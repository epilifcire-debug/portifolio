import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BUCKET, resolveMedia } from "@/lib/media";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  projectSlug: string;
  projectId: string;
  mediaKind: "card" | "hero" | "og";
  disabled?: boolean;
  helpText?: string;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  projectSlug,
  projectId,
  mediaKind,
  disabled,
  helpText,
}: ImageUploadFieldProps) {
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function loadPreview(path: string) {
    if (!path) {
      setPreview("");
      return;
    }
    if (/^https?:\/\//i.test(path)) {
      setPreview(path);
      return;
    }
    const resolved = await resolveMedia([{ id: "preview", project_slug: projectSlug, url: path, caption: "", kind: mediaKind, sort_order: 0 }]);
    setPreview(resolved[0]?.src || "");
  }

  useState(() => {
    void loadPreview(value);
  });

  async function onUpload(file: File) {
    if (!projectSlug || !projectId) {
      return;
    }
    setLoading(true);
    try {
      const ext = file.name.split(".").pop() ?? "png";
      const path = `${projectSlug}/${mediaKind}-${crypto.randomUUID()}.${ext}`;

      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;

      // Remove previous media of same kind for this project
      const { data: existing } = await supabase
        .from("project_media")
        .select("id, url")
        .eq("project_slug", projectSlug)
        .eq("media_kind", mediaKind);

      if (existing && existing.length > 0) {
        const ids = existing.map((m) => m.id);
        const storagePaths = existing.map((m) => m.url).filter((url) => !/^https?:\/\//i.test(url));
        await supabase.from("project_media").delete().in("id", ids);
        if (storagePaths.length > 0) {
          await supabase.storage.from(BUCKET).remove(storagePaths);
        }
      }

      await supabase.from("project_media").insert({
        project_slug: projectSlug,
        project_id: projectId,
        url: path,
        caption: `${label}`,
        alt: `${label} do projeto`,
        kind: mediaKind,
        media_kind: mediaKind,
        fit: mediaKind === "hero" ? "cover" : "contain",
        position: "center",
        sort_order: 0,
      });

      onChange(path);
      await loadPreview(path);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function clear() {
    onChange("");
    setPreview("");
  }

  const currentSrc = preview || value;
  const isExternal = /^https?:\/\//i.test(value);
  const displaySrc = isExternal ? value : preview;

  if (disabled) {
    return (
      <label className="block text-xs text-muted-foreground">
        {label}
        <div className="mt-1.5 rounded-md border border-dashed border-border bg-secondary/30 p-4 text-center text-xs text-muted-foreground">
          Salve o projeto primeiro para fazer upload de imagens.
        </div>
      </label>
    );
  }

  return (
    <label className="block text-xs text-muted-foreground">
      {label}
      {helpText && <span className="ml-1 text-[10px] text-muted-foreground/70">{helpText}</span>}
      <div className="mt-1.5">
        {displaySrc ? (
          <div className="relative overflow-hidden rounded-md border border-border bg-secondary/30">
            <img src={displaySrc} alt={label} className="aspect-video w-full object-contain" />
            <button
              type="button"
              onClick={clear}
              className="absolute right-2 top-2 grid size-7 place-items-center rounded-md bg-black/70 text-white hover:bg-black/90"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={loading}
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-secondary/30 p-6 text-xs text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
          >
            {loading ? <Loader2 className="size-5 animate-spin text-primary" /> : <ImageIcon className="size-5 text-primary" />}
            <span>{loading ? "Enviando..." : "Clique para enviar imagem"}</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={loading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) void onUpload(file);
          }}
        />
      </div>
      {value && !isExternal && (
        <p className="mt-1 truncate text-[10px] text-muted-foreground">{value}</p>
      )}
    </label>
  );
}
