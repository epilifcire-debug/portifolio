import { useEffect, useState } from "react";
import { X, Save, Plus, Trash2, GripVertical, AlertCircle, Eye } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Category, ProjectFeature, ProjectWithCategory } from "@/lib/admin";
import { PROJECT_STATUS_LABELS, slugify, DEFAULT_LUCIDE_ICONS } from "@/lib/admin";
import { ImageUploadField } from "./ImageUploadField";
import { resolveMedia } from "@/lib/media";

const emptyProject: Partial<ProjectWithCategory> = {
  name: "",
  slug: "",
  solution_type: "",
  short_description: "",
  description: "",
  about: "",
  challenge: "",
  solution: "",
  results: "",
  category_id: null,
  tags: [],
  technologies: [],
  status: "desenvolvimento",
  card_image: "",
  hero_image: "",
  public_url: "",
  demo_url: "",
  seo_title: "",
  seo_description: "",
  og_title: "",
  og_description: "",
  og_image: "",
  canonical: "",
  sort_order: 0,
  featured_order: 0,
  is_published: false,
  is_archived: false,
  is_featured: false,
  show_access_button: false,
  show_technologies: true,
  show_challenge: true,
  show_solution: true,
  show_results: true,
};

export function ProjectForm({
  project,
  categories,
  onClose,
}: {
  project?: ProjectWithCategory | undefined;
  categories: Category[];
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Partial<ProjectWithCategory>>(project ? { ...project } : { ...emptyProject });
  const [features, setFeatures] = useState<ProjectFeature[]>([]);
  const [newFeature, setNewFeature] = useState<Partial<ProjectFeature>>({ icon: "Check", title: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [ogPreviewUrl, setOgPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (!form.og_image || !form.slug) {
      setOgPreviewUrl("");
      return;
    }
    void resolveMedia([{ id: "og", project_slug: form.slug, url: form.og_image, caption: "", kind: "og", sort_order: 0 }]).then((resolved) => {
      setOgPreviewUrl(resolved[0]?.src || form.og_image || "");
    });
  }, [form.og_image, form.slug]);

  useEffect(() => {
    if (!project?.id) return;
    supabase
      .from("project_features")
      .select("*")
      .eq("project_id", project.id)
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (!error) setFeatures((data ?? []) as ProjectFeature[]);
      });
  }, [project?.id]);

  function updateForm<K extends keyof ProjectWithCategory>(key: K, value: ProjectWithCategory[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function parseTags(value: string) {
    return value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  async function addFeature() {
    const title = newFeature.title?.trim();
    if (!title) {
      toast.error("Informe o título da funcionalidade.");
      return;
    }
    if (!project?.id) {
      setFeatures((prev) => [
        ...prev,
        {
          id: `temp-${crypto.randomUUID()}`,
          project_id: "",
          icon: newFeature.icon || "Check",
          title,
          description: newFeature.description?.trim() ?? "",
          sort_order: prev.length,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as ProjectFeature,
      ]);
      setNewFeature({ icon: "Check", title: "", description: "" });
      return;
    }

    const { data, error } = await supabase
      .from("project_features")
      .insert({
        project_id: project.id,
        icon: newFeature.icon || "Check",
        title,
        description: newFeature.description?.trim() ?? "",
        sort_order: features.length,
      })
      .select()
      .single();

    if (error) {
      toast.error("Não foi possível adicionar funcionalidade.");
      return;
    }
    setFeatures((prev) => [...prev, data as ProjectFeature]);
    setNewFeature({ icon: "Check", title: "", description: "" });
  }

  async function removeFeature(id: string) {
    if (!confirm("Remover funcionalidade?")) return;
    if (project?.id) {
      const { error } = await supabase.from("project_features").delete().eq("id", id);
      if (error) {
        toast.error("Não foi possível remover.");
        return;
      }
    }
    setFeatures((prev) => prev.filter((f) => f.id !== id));
  }

  async function checkSlugUnique(slug: string) {
    const { data, error } = await supabase.from("projects").select("id").eq("slug", slug).maybeSingle();
    if (error) {
      setSlugError("Não foi possível verificar o slug.");
      return false;
    }
    if (data && data.id !== project?.id) {
      setSlugError("Este slug já está em uso por outro projeto.");
      return false;
    }
    setSlugError(null);
    return true;
  }

  async function save() {
    const payload = {
      name: (form.name ?? "").trim(),
      slug: (form.slug ?? "").trim() || slugify(form.name ?? ""),
      solution_type: (form.solution_type ?? "").trim(),
      short_description: (form.short_description ?? "").trim(),
      description: (form.description ?? "").trim(),
      about: (form.about ?? "").trim(),
      challenge: (form.challenge ?? "").trim(),
      solution: (form.solution ?? "").trim(),
      results: (form.results ?? "").trim(),
      category_id: form.category_id || null,
      tags: form.tags ?? [],
      technologies: form.technologies ?? [],
      status: form.status ?? "desenvolvimento",
      card_image: (form.card_image ?? "").trim(),
      hero_image: (form.hero_image ?? "").trim(),
      public_url: (form.public_url ?? "").trim(),
      demo_url: (form.demo_url ?? "").trim(),
      seo_title: (form.seo_title ?? "").trim(),
      seo_description: (form.seo_description ?? "").trim(),
      og_title: (form.og_title ?? "").trim(),
      og_description: (form.og_description ?? "").trim(),
      og_image: (form.og_image ?? "").trim(),
      canonical: (form.canonical ?? "").trim(),
      sort_order: form.sort_order ?? 0,
      featured_order: form.featured_order ?? 0,
      is_published: form.is_published ?? false,
      is_archived: form.is_archived ?? false,
      is_featured: form.is_featured ?? false,
      show_access_button: form.show_access_button ?? false,
      show_technologies: form.show_technologies ?? true,
      show_challenge: form.show_challenge ?? true,
      show_solution: form.show_solution ?? true,
      show_results: form.show_results ?? true,
    };

    if (!payload.name || !payload.slug) {
      toast.error("Nome e slug são obrigatórios.");
      return;
    }

    const unique = await checkSlugUnique(payload.slug);
    if (!unique) return;

    setSaving(true);
    try {
      let projectId = project?.id;
      if (project?.id) {
        const { error } = await supabase.from("projects").update(payload).eq("id", project.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("projects").insert(payload).select().single();
        if (error) throw error;
        projectId = (data as ProjectWithCategory).id;
      }

      if (projectId) {
        for (const f of features) {
          if (!f.id.startsWith("temp-")) continue;
          await supabase.from("project_features").insert({
            project_id: projectId,
            icon: f.icon,
            title: f.title,
            description: f.description,
            sort_order: f.sort_order,
          });
        }
      }

      toast.success("Projeto salvo.");
      queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao salvar projeto.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60";
  const labelClass = "block text-xs text-muted-foreground";

  return (
    <section className="panel p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">{project ? "Editar projeto" : "Novo projeto"}</h2>
        <button
          type="button"
          onClick={onClose}
          className="grid size-8 place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Nome
            <input value={form.name ?? ""} onChange={(e) => updateForm("name", e.target.value)} className={inputClass} />
          </label>
          <label className={labelClass}>
            Slug
            <input
              value={form.slug ?? ""}
              onChange={(e) => {
                updateForm("slug", e.target.value);
                setSlugError(null);
              }}
              className={`${inputClass} ${slugError ? "border-destructive focus:border-destructive" : ""}`}
            />
            {slugError && (
              <span className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
                <AlertCircle className="size-3" /> {slugError}
              </span>
            )}
          </label>
          <label className={labelClass}>
            Tipo da solução
            <input value={form.solution_type ?? ""} onChange={(e) => updateForm("solution_type", e.target.value)} className={inputClass} />
          </label>
          <label className={labelClass}>
            Categoria
            <select
              value={form.category_id ?? ""}
              onChange={(e) => updateForm("category_id", e.target.value || null)}
              className={inputClass}
            >
              <option value="">Sem categoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Status
            <select value={form.status ?? "desenvolvimento"} onChange={(e) => updateForm("status", e.target.value as ProjectWithCategory["status"])} className={inputClass}>
              {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Tags (separadas por vírgula)
            <input
              value={(form.tags ?? []).join(", ")}
              onChange={(e) => updateForm("tags", parseTags(e.target.value))}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Tecnologias (separadas por vírgula)
            <input
              value={(form.technologies ?? []).join(", ")}
              onChange={(e) => updateForm("technologies", parseTags(e.target.value))}
              className={inputClass}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Descrição curta
            <textarea
              value={form.short_description ?? ""}
              onChange={(e) => updateForm("short_description", e.target.value)}
              rows={3}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Descrição completa
            <textarea
              value={form.description ?? ""}
              onChange={(e) => updateForm("description", e.target.value)}
              rows={3}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Sobre o projeto
            <textarea value={form.about ?? ""} onChange={(e) => updateForm("about", e.target.value)} rows={3} className={inputClass} />
          </label>
          <label className={labelClass}>
            Desafio
            <textarea value={form.challenge ?? ""} onChange={(e) => updateForm("challenge", e.target.value)} rows={3} className={inputClass} />
          </label>
          <label className={labelClass}>
            Solução
            <textarea value={form.solution ?? ""} onChange={(e) => updateForm("solution", e.target.value)} rows={3} className={inputClass} />
          </label>
          <label className={labelClass}>
            Resultados
            <textarea value={form.results ?? ""} onChange={(e) => updateForm("results", e.target.value)} rows={3} className={inputClass} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            URL pública
            <input value={form.public_url ?? ""} onChange={(e) => updateForm("public_url", e.target.value)} className={inputClass} />
          </label>
          <label className={labelClass}>
            URL demonstrativa
            <input value={form.demo_url ?? ""} onChange={(e) => updateForm("demo_url", e.target.value)} className={inputClass} />
          </label>
          <ImageUploadField
            label="Imagem do card"
            value={form.card_image ?? ""}
            onChange={(v) => updateForm("card_image", v)}
            projectSlug={form.slug ?? ""}
            projectId={project?.id ?? ""}
            mediaKind="card"
            disabled={!project?.id}
            helpText="(ratio livre, usada no catálogo)"
          />
          <ImageUploadField
            label="Imagem do Hero"
            value={form.hero_image ?? ""}
            onChange={(v) => updateForm("hero_image", v)}
            projectSlug={form.slug ?? ""}
            projectId={project?.id ?? ""}
            mediaKind="hero"
            disabled={!project?.id}
            helpText="(wide, usada no topo da página)"
          />
        </div>

        <div className="rounded-xl border border-border bg-secondary/30 p-4">
          <h3 className="text-sm font-bold text-foreground">Visibilidade</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["is_published", "Publicado"] as const,
              ["is_featured", "Destaque"] as const,
              ["is_archived", "Arquivado"] as const,
              ["show_access_button", "Botão acessar"] as const,
              ["show_technologies", "Mostrar tecnologias"] as const,
              ["show_challenge", "Mostrar desafio"] as const,
              ["show_solution", "Mostrar solução"] as const,
              ["show_results", "Mostrar resultados"] as const,
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={!!form[key]}
                  onChange={(e) => updateForm(key, e.target.checked as ProjectWithCategory[typeof key])}
                  className="size-4 rounded border-border"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-secondary/30 p-4">
          <h3 className="text-sm font-bold text-foreground">SEO</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              SEO title
              <input value={form.seo_title ?? ""} onChange={(e) => updateForm("seo_title", e.target.value)} className={inputClass} />
            </label>
            <label className={labelClass}>
              Meta description
              <input value={form.seo_description ?? ""} onChange={(e) => updateForm("seo_description", e.target.value)} className={inputClass} />
            </label>
            <label className={labelClass}>
              OG title
              <input value={form.og_title ?? ""} onChange={(e) => updateForm("og_title", e.target.value)} className={inputClass} />
            </label>
            <label className={labelClass}>
              OG description
              <input value={form.og_description ?? ""} onChange={(e) => updateForm("og_description", e.target.value)} className={inputClass} />
            </label>
            <ImageUploadField
              label="OG image"
              value={form.og_image ?? ""}
              onChange={(v) => updateForm("og_image", v)}
              projectSlug={form.slug ?? ""}
              projectId={project?.id ?? ""}
              mediaKind="og"
              disabled={!project?.id}
              helpText="(1200×630 ideal para compartilhamento)"
            />
            <label className={labelClass}>
              Canonical
              <input value={form.canonical ?? ""} onChange={(e) => updateForm("canonical", e.target.value)} className={inputClass} />
            </label>
          </div>

          {(form.og_title || form.og_description || ogPreviewUrl) && (
            <div className="mt-5 rounded-lg border border-border bg-background/60 p-4">
              <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold text-foreground">
                <Eye className="size-3.5 text-primary" /> Pré-visualização do compartilhamento
              </h4>
              <div className="flex flex-col gap-3 sm:flex-row">
                {ogPreviewUrl ? (
                  <img src={ogPreviewUrl} alt="OG preview" className="h-32 w-full rounded-md object-cover sm:w-48" />
                ) : (
                  <div className="grid h-32 w-full place-items-center rounded-md bg-secondary/50 text-xs text-muted-foreground sm:w-48">
                    Sem imagem
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {form.og_title || form.seo_title || form.name || "Título do projeto"}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {form.og_description || form.seo_description || form.short_description || "Descrição do projeto"}
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-wide text-muted-foreground/70">
                    efcsys.com/projects/{form.slug || "slug"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-secondary/30 p-4">
          <h3 className="text-sm font-bold text-foreground">Funcionalidades</h3>
          <div className="mt-3 space-y-2">
            {features.map((f, i) => (
              <div key={f.id} className="flex items-center gap-2 rounded-lg border border-border bg-card/60 p-2">
                <GripVertical className="size-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{f.title}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(f.id)}
                  className="ml-auto grid size-7 place-items-center rounded-md text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
            <div className="grid gap-2 sm:grid-cols-4">
              <select
                value={newFeature.icon ?? "Check"}
                onChange={(e) => setNewFeature({ ...newFeature, icon: e.target.value })}
                className={inputClass}
              >
                {DEFAULT_LUCIDE_ICONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
              <input
                value={newFeature.title ?? ""}
                onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                placeholder="Título"
                className={inputClass}
              />
              <input
                value={newFeature.description ?? ""}
                onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                placeholder="Descrição"
                className={inputClass}
              />
              <button
                type="button"
                onClick={addFeature}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/60"
              >
                <Plus className="size-4" /> Adicionar
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={save}
            className="bg-gold-metal inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            <Save className="size-4" /> {saving ? "Salvando..." : "Salvar projeto"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/60"
          >
            <X className="size-4" /> Cancelar
          </button>
        </div>
      </div>
    </section>
  );
}
