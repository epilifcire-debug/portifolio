import { useEffect, useState } from "react";
import { Plus, Save, Trash2, X, Eye, EyeOff } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Testimonial = Tables<"testimonials">;

async function fetchAll(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Testimonial[];
}

const inputClass =
  "mt-1.5 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60";

export function TestimonialsTab() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin", "testimonials"], queryFn: fetchAll });
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);

  useEffect(() => {
    setItems(data ?? []);
  }, [data]);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] });
    queryClient.invalidateQueries({ queryKey: ["testimonials", "public"] });
  }

  async function save(t: Partial<Testimonial>) {
    if (!t.author_name?.trim() || !t.quote?.trim()) {
      toast.error("Informe o nome e o depoimento.");
      return;
    }
    const payload = {
      author_name: t.author_name.trim(),
      author_role: t.author_role?.trim() ?? "",
      company: t.company?.trim() ?? "",
      quote: t.quote.trim(),
      avatar_url: t.avatar_url?.trim() ?? "",
      rating: Math.min(5, Math.max(0, Number(t.rating ?? 5))),
      is_published: t.is_published ?? true,
      sort_order: Number(t.sort_order ?? items.length),
    };

    const { error } = t.id
      ? await supabase.from("testimonials").update(payload).eq("id", t.id)
      : await supabase.from("testimonials").insert(payload);

    if (error) {
      toast.error("Não foi possível salvar o depoimento.");
      return;
    }
    setEditing(null);
    toast.success("Depoimento salvo.");
    invalidate();
  }

  async function togglePublish(t: Testimonial) {
    const { error } = await supabase
      .from("testimonials")
      .update({ is_published: !t.is_published })
      .eq("id", t.id);
    if (error) {
      toast.error("Não foi possível atualizar.");
      return;
    }
    invalidate();
  }

  async function remove(id: string) {
    if (!confirm("Excluir este depoimento?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      toast.error("Não foi possível excluir.");
      return;
    }
    toast.success("Depoimento excluído.");
    invalidate();
  }

  return (
    <section className="panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Depoimentos</h2>
          <p className="text-xs text-muted-foreground">
            Depoimentos publicados aparecem na página inicial.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setEditing({ author_name: "", quote: "", rating: 5, is_published: true, sort_order: items.length })
          }
          className="bg-gold-metal inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="size-4" /> Novo depoimento
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
            Nome do cliente
            <input
              value={editing.author_name ?? ""}
              onChange={(e) => setEditing({ ...editing, author_name: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="block text-xs text-muted-foreground">
            Cargo
            <input
              value={editing.author_role ?? ""}
              onChange={(e) => setEditing({ ...editing, author_role: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="block text-xs text-muted-foreground">
            Empresa
            <input
              value={editing.company ?? ""}
              onChange={(e) => setEditing({ ...editing, company: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="block text-xs text-muted-foreground">
            Foto (URL)
            <input
              value={editing.avatar_url ?? ""}
              onChange={(e) => setEditing({ ...editing, avatar_url: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="block text-xs text-muted-foreground sm:col-span-2">
            Depoimento
            <textarea
              rows={4}
              value={editing.quote ?? ""}
              onChange={(e) => setEditing({ ...editing, quote: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="block text-xs text-muted-foreground">
            Nota (0 a 5)
            <input
              type="number"
              min={0}
              max={5}
              value={editing.rating ?? 5}
              onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}
              className={inputClass}
            />
          </label>
          <label className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={editing.is_published ?? true}
              onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })}
            />
            Publicado
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
          <p className="text-sm text-muted-foreground">Nenhum depoimento cadastrado ainda.</p>
        )}
        {items.map((t) => (
          <div
            key={t.id}
            className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                {t.author_name}
                {t.company ? ` · ${t.company}` : ""}
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{t.quote}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void togglePublish(t)}
                title={t.is_published ? "Despublicar" : "Publicar"}
                className="rounded-md border border-border p-2 text-muted-foreground hover:border-primary/60 hover:text-primary"
              >
                {t.is_published ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </button>
              <button
                type="button"
                onClick={() => setEditing(t)}
                className="rounded-md border border-border px-3 py-2 text-xs text-foreground hover:border-primary/60"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => void remove(t.id)}
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
