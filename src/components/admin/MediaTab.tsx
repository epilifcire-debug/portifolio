import { useEffect, useMemo, useState } from "react";
import { Upload, Trash2, Image as ImageIcon, GripVertical } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BUCKET, resolveMedia } from "@/lib/media";
import type { ProjectMedia, ProjectWithCategory } from "@/lib/admin";
import { MEDIA_KIND_LABELS } from "@/lib/admin";
import { SortableRow } from "./SortableRow";

const HERO_SLUG = "__home_hero__";

type MediaItem = ProjectMedia & { src: string };

export function MediaTab({ projects }: { projects: ProjectWithCategory[] }) {
  const queryClient = useQueryClient();
  const [target, setTarget] = useState<string>(HERO_SLUG);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [alt, setAlt] = useState("");
  const [kind, setKind] = useState<"card" | "hero" | "gallery_desktop" | "gallery_mobile" | "og">("gallery_desktop");
  const [fit, setFit] = useState<"contain" | "cover">("contain");

  const project = useMemo(() => projects.find((p) => p.slug === target), [projects, target]);

  async function loadMedia() {
    setLoading(true);
    const { data, error } = await supabase
      .from("project_media")
      .select("*")
      .eq("project_slug", target)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) {
      toast.error("Não foi possível carregar mídias.");
      setLoading(false);
      return;
    }
    const rows = (data ?? []) as ProjectMedia[];
    const resolved = await resolveMedia(rows as { id: string; project_slug: string; url: string; caption: string; kind: string; sort_order: number }[]);
    setMedia(resolved as unknown as MediaItem[]);
    setLoading(false);
  }

  useEffect(() => {
    void loadMedia();
  }, [target]);

  async function onUpload(file: File) {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "png";
      const folder = target === HERO_SLUG ? "home" : target;
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;

      const { error } = await supabase.from("project_media").insert({
        project_slug: target,
        project_id: project?.id ?? null,
        url: path,
        caption: caption || file.name,
        alt: alt || caption || file.name,
        kind,
        media_kind: kind,
        fit,
        position: "center",
        sort_order: media.length,
      });
      if (error) throw error;

      setCaption("");
      setAlt("");
      toast.success("Imagem enviada.");
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha no envio.");
    } finally {
      setUploading(false);
    }
  }

  async function removeMedia(id: string, url: string) {
    const { error } = await supabase.from("project_media").delete().eq("id", id);
    if (error) {
      toast.error("Não foi possível remover.");
      return;
    }
    if (!/^https?:\/\//i.test(url)) {
      await supabase.storage.from(BUCKET).remove([url]);
    }
    toast.success("Imagem removida.");
    refresh();
  }

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["project-media"] });
    void loadMedia();
  }

  async function reorder(from: number, to: number) {
    const next = [...media];
    const moved = next.splice(from, 1)[0]!;
    next.splice(to, 0, moved);
    setMedia(next);

    const updates = next.map((m, i) => ({ id: m.id, sort_order: i }));
    for (const u of updates) {
      await supabase.from("project_media").update({ sort_order: u.sort_order }).eq("id", u.id);
    }
    queryClient.invalidateQueries({ queryKey: ["project-media"] });
  }

  const inputClass =
    "mt-1.5 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60";
  const labelClass = "block text-xs text-muted-foreground";

  return (
    <section className="panel p-6">
      <h2 className="text-lg font-bold text-foreground">Mídia</h2>
      <p className="text-xs text-muted-foreground">Mockups, prints de tela, imagens de card/hero/OG.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className={labelClass}>
          Página / projeto
          <select value={target} onChange={(e) => setTarget(e.target.value)} className={inputClass}>
            <option value={HERO_SLUG}>Home — mockup do topo</option>
            {projects.map((p) => (
              <option key={p.id} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Tipo
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as typeof kind)}
            className={inputClass}
          >
            {Object.entries(MEDIA_KIND_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Legenda
          <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Tela de agenda" className={inputClass} />
        </label>
        <label className={labelClass}>
          Alt
          <input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Descrição acessível" className={inputClass} />
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className={labelClass}>
          Ajuste da imagem
          <select value={fit} onChange={(e) => setFit(e.target.value as typeof fit)} className={inputClass}>
            <option value="contain">Contain</option>
            <option value="cover">Cover</option>
          </select>
        </label>
      </div>

      <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-md border border-primary/60 px-4 py-2.5 text-sm font-medium text-primary">
        <Upload className="size-4" />
        {uploading ? "Enviando..." : "Enviar imagem"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) void onUpload(file);
          }}
        />
      </label>

      <p className="mt-6 text-xs text-muted-foreground">Arraste pela alça para reordenar as imagens.</p>

      <div className="mt-3 space-y-2">
        {loading && <p className="text-sm text-muted-foreground">Carregando...</p>}
        {!loading &&
          media.map((m, i) => (
            <SortableRow key={m.id} id={m.id} index={i} onMove={(from, to) => void reorder(from, to)}>
              <div className="flex items-center gap-3">
                <img
                  src={m.src}
                  alt={m.alt || m.caption}
                  loading="lazy"
                  className="size-16 shrink-0 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">{m.caption}</p>
                  <p className="text-[11px] text-muted-foreground">{MEDIA_KIND_LABELS[m.media_kind] ?? m.kind}</p>
                </div>
                <button
                  type="button"
                  aria-label="Remover"
                  onClick={() => removeMedia(m.id, m.url)}
                  className="grid size-8 shrink-0 place-items-center rounded-md border border-border text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </SortableRow>
          ))}
        {!loading && media.length === 0 && (
          <div className="panel flex items-center gap-3 p-5 text-sm text-muted-foreground">
            <ImageIcon className="size-4 text-primary" /> Nenhuma imagem enviada ainda.
          </div>
        )}
      </div>

    </section>
  );
}
