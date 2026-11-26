import { useEffect, useState } from "react";
import { Plus, Save, Trash2, X, Eye, EyeOff } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/admin";
import type { Tables } from "@/integrations/supabase/types";

type Article = Tables<"articles">;

async function fetchAll(): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Article[];
}

const inputClass =
  "mt-1.5 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60";

export function ArticlesTab() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin", "articles"], queryFn: fetchAll });
  const [items, setItems] = useState<Article[]>([]);
  const [editing, setEditing] = useState<Partial<Article> | null>(null);

  useEffect(() => {
    setItems(data ?? []);
  }, [data]);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin", "articles"] });
    queryClient.invalidateQueries({ queryKey: ["articles", "public"] });
  }

  async function save(a: Partial<Article>) {
    const title = a.title?.trim() ?? "";
    if (!title) {
      toast.error("Informe o título do artigo.");
      return;
    }
    const slug = (a.slug?.trim() ? slugify(a.slug) : slugify(title)) || slugify(title);

    const payload = {
      slug,
      title,
      excerpt: a.excerpt?.trim() ?? "",
      content: a.content ?? "",
      cover_image: a.cover_image?.trim() ?? "",
      tags: (Array.isArray(a.tags) ? a.tags : []).filter(Boolean),
      read_minutes: Math.max(1, Number(a.read_minutes ?? 4)),
      seo_title: a.seo_title?.trim() ?? "",
      seo_description: a.seo_description?.trim() ?? "",
      is_published: a.is_published ?? false,
      published_at: a.published_at ?? new Date().toISOString(),
      sort_order: Number(a.sort_order ?? 0),
    };

    const { error } = a.id
      ? await supabase.from("articles").update(payload).eq("id", a.id)
      : await supabase.from("articles").insert(payload);

    if (error) {
      toast.error(
        error.message.includes("duplicate")
          ? "Já existe um artigo com esse endereço."
          : "Não foi possível salvar o artigo.",
      );
      return;
    }
    setEditing(null);
    toast.success("Artigo salvo.");
    invalidate();
  }

  async function togglePublish(a: Article) {
    const { error } = await supabase
      .from("articles")
      .update({ is_published: !a.is_published })
      .eq("id", a.id);
    if (error) {
      toast.error("Não foi possível atualizar.");
      return;
    }
    invalidate();
  }

  async function remove(id: string) {
    if (!confirm("Excluir este artigo?")) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) {
      toast.error("Não foi possível excluir.");
      return;
    }
    toast.success("Artigo excluído.");
    invalidate();
  }

  return (
    <section className="panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Artigos e cases</h2>
          <p className="text-xs text-muted-foreground">
            Conteúdos publicados aparecem na página de artigos.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setEditing({ title: "", slug: "", content: "", read_minutes: 4, is_published: false, tags: [] })
          }
          className="bg-gold-metal inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="size-4" /> Novo artigo
        </button>
      </div>

      {editing && (
        <form
          className="mt-5 grid gap-4 rounded-xl border border-border bg-secondary/40 p-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            void save(editing);
          }}
        >
          <label className="block text-xs text-muted-foreground">
            Título
            <input
              value={editing.title ?? ""}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="block text-xs text-muted-foreground">
            Endereço (slug)
            <input
              value={editing.slug ?? ""}
              placeholder="gerado a partir do título"
              onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="block text-xs text-muted-foreground sm:col-span-2">
            Resumo
            <textarea
              rows={2}
              value={editing.excerpt ?? ""}
              onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="block text-xs text-muted-foreground sm:col-span-2">
            Conteúdo (use uma linha em branco entre parágrafos e "## " para subtítulos)
            <textarea
              rows={12}
              value={editing.content ?? ""}
              onChange={(e) => setEditing({ ...editing, content: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="block text-xs text-muted-foreground">
            Imagem de capa (URL)
            <input
              value={editing.cover_image ?? ""}
              onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="block text-xs text-muted-foreground">
            Tags (separadas por vírgula)
            <input
              value={(editing.tags ?? []).join(", ")}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  tags: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                })
              }
              className={inputClass}
            />
          </label>
          <label className="block text-xs text-muted-foreground">
            Tempo de leitura (min)
            <input
              type="number"
              min={1}
              value={editing.read_minutes ?? 4}
              onChange={(e) => setEditing({ ...editing, read_minutes: Number(e.target.value) })}
              className={inputClass}
            />
          </label>
          <label className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={editing.is_published ?? false}
              onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })}
            />
            Publicado
          </label>
          <label className="block text-xs text-muted-foreground">
            Título SEO
            <input
              value={editing.seo_title ?? ""}
              onChange={(e) => setEditing({ ...editing, seo_title: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="block text-xs text-muted-foreground">
            Descrição SEO
            <input
              value={editing.seo_description ?? ""}
              onChange={(e) => setEditing({ ...editing, seo_description: e.target.value })}
              className={inputClass}
            />
          </label>

          <div className="flex items-end gap-2 sm:col-span-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-primary/60"
            >
              <Save className="size-4" /> Salvar
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/60"
            >
              <X className="size-4" /> Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground">Carregando...</p>}
        {!isLoading && items.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum artigo cadastrado ainda.</p>
        )}
        {items.map((a) => (
          <div
            key={a.id}
            className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">{a.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                /articles/{a.slug} · {a.is_published ? "Publicado" : "Rascunho"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void togglePublish(a)}
                title={a.is_published ? "Despublicar" : "Publicar"}
                className="rounded-md border border-border p-2 text-muted-foreground hover:border-primary/60 hover:text-primary"
              >
                {a.is_published ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </button>
              <button
                type="button"
                onClick={() => setEditing(a)}
                className="rounded-md border border-border px-3 py-2 text-xs text-foreground hover:border-primary/60"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => void remove(a.id)}
                className="rounded-md border border-border p-2 text-muted-foreground hover:border-destructive/60 hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
