import { useMemo, useState } from "react";
import { Edit2, Eye, EyeOff, Star, Trash2, Copy, Archive, Plus, Search } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Category, Project, ProjectWithCategory } from "@/lib/admin";
import { PROJECT_STATUS_LABELS } from "@/lib/admin";
import { ProjectForm } from "./ProjectForm";

export function ProjectsTab({ projects, categories }: { projects: ProjectWithCategory[]; categories: Category[] }) {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "published" | "featured" | "archived">("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<ProjectWithCategory | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    let list = [...projects];
    if (filter === "published") list = list.filter((p) => p.is_published && !p.is_archived);
    if (filter === "featured") list = list.filter((p) => p.is_featured);
    if (filter === "archived") list = list.filter((p) => p.is_archived);

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.solution_type.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [projects, filter, search]);

  async function toggleField(id: string, field: keyof Project, value: boolean) {
    const { error } = await supabase.from("projects").update({ [field]: value } as Partial<Project>).eq("id", id);
    if (error) {
      toast.error("Não foi possível atualizar.");
      return;
    }
    toast.success("Projeto atualizado.");
    queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
  }

  async function duplicate(project: ProjectWithCategory) {
    const { id, created_at, updated_at, category, ...rest } = project;
    const newSlug = `${rest.slug}-copia`;
    const { error } = await supabase.from("projects").insert({ ...rest, slug: newSlug, name: `${rest.name} (cópia)`, is_published: false });
    if (error) {
      toast.error("Não foi possível duplicar.");
      return;
    }
    toast.success("Projeto duplicado.");
    queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
  }

  async function remove(id: string) {
    if (!confirm("Excluir permanentemente este projeto?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      toast.error("Não foi possível excluir.");
      return;
    }
    toast.success("Projeto excluído.");
    queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
  }

  if (editing || creating) {
    return (
      <ProjectForm
        project={editing ?? undefined}
        categories={categories}
        onClose={() => {
          setEditing(null);
          setCreating(false);
        }}
      />
    );
  }


  return (
    <section className="panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Projetos</h2>
          <p className="text-xs text-muted-foreground">Cadastre, edite e organize os cases do portfólio.</p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="bg-gold-metal inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="size-4" /> Novo projeto
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar projeto ou solução"
            className="w-full rounded-md border border-input bg-background/60 py-2 pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary/60"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="rounded-md border border-input bg-background/60 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60"
        >
          <option value="all">Todos</option>
          <option value="published">Publicados</option>
          <option value="featured">Destaques</option>
          <option value="archived">Arquivados</option>
        </select>
      </div>

      <div className="mt-5 space-y-2">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card/60 p-4 sm:flex-row sm:items-center"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">{p.name}</p>
              <p className="text-xs text-muted-foreground">
                {p.solution_type} • {p.category?.name || "Sem categoria"} • {PROJECT_STATUS_LABELS[p.status]}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => toggleField(p.id, "is_published", !p.is_published)}
                title={p.is_published ? "Despublicar" : "Publicar"}
                className={`grid size-8 place-items-center rounded-md border border-border ${p.is_published ? "text-primary" : "text-muted-foreground"}`}
              >
                {p.is_published ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </button>
              <button
                type="button"
                onClick={() => toggleField(p.id, "is_featured", !p.is_featured)}
                title={p.is_featured ? "Remover destaque" : "Destacar"}
                className={`grid size-8 place-items-center rounded-md border border-border ${p.is_featured ? "text-primary" : "text-muted-foreground"}`}
              >
                <Star className={`size-4 ${p.is_featured ? "fill-current" : ""}`} />
              </button>
              <button
                type="button"
                onClick={() => toggleField(p.id, "is_archived", !p.is_archived)}
                title={p.is_archived ? "Desarquivar" : "Arquivar"}
                className={`grid size-8 place-items-center rounded-md border border-border ${p.is_archived ? "text-primary" : "text-muted-foreground"}`}
              >
                <Archive className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => duplicate(p)}
                title="Duplicar"
                className="grid size-8 place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground"
              >
                <Copy className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setEditing(p)}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary/60"
              >
                <Edit2 className="size-3.5" /> Editar
              </button>
              <button
                type="button"
                onClick={() => remove(p.id)}
                aria-label="Excluir"
                className="grid size-8 place-items-center rounded-md border border-border text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground">Nenhum projeto encontrado.</p>}
      </div>
    </section>
  );
}
