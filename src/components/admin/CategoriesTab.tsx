import { useEffect, useState } from "react";
import { Plus, Save, Trash2, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Category } from "@/lib/admin";
import { slugify } from "@/lib/admin";
import { SortableRow } from "./SortableRow";

export function CategoriesTab({ categories }: { categories: Category[] }) {
  const queryClient = useQueryClient();
  const [items, setItems] = useState<Category[]>(categories);
  const [editing, setEditing] = useState<Partial<Category> | null>(null);

  useEffect(() => {
    setItems(categories);
  }, [categories]);

  async function save(category: Partial<Category>) {
    const payload = {
      name: category.name?.trim() ?? "",
      slug: slugify(category.name?.trim() ?? ""),
      sort_order: category.sort_order ?? 0,
    };

    if (!payload.name) {
      toast.error("Informe o nome da categoria.");
      return;
    }

    if (category.id) {
      const { error } = await supabase.from("categories").update(payload).eq("id", category.id);
      if (error) {
        toast.error("Não foi possível salvar.");
        return;
      }
    } else {
      const { error } = await supabase.from("categories").insert(payload);
      if (error) {
        toast.error("Não foi possível criar.");
        return;
      }
    }

    setEditing(null);
    toast.success("Categoria salva.");
    queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
  }

  async function remove(id: string) {
    if (!confirm("Excluir esta categoria?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      toast.error("Não foi possível excluir.");
      return;
    }
    toast.success("Categoria excluída.");
    queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
  }

  async function reorder(from: number, to: number) {
    const next = [...items];
    const moved = next.splice(from, 1)[0]!;
    next.splice(to, 0, moved);
    setItems(next);

    const updates = next.map((c, i) => ({ id: c.id, sort_order: i }));
    for (const u of updates) {
      await supabase.from("categories").update({ sort_order: u.sort_order }).eq("id", u.id);
    }
    queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
  }

  return (
    <section className="panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Categorias</h2>
          <p className="text-xs text-muted-foreground">Categorias usadas nos projetos e filtros.</p>
        </div>
        <button
          type="button"
          onClick={() => setEditing({ name: "", slug: "", sort_order: items.length })}
          className="bg-gold-metal inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="size-4" /> Nova categoria
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
            Nome
            <input
              value={editing.name ?? ""}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              className="mt-1.5 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60"
            />
          </label>
          <div className="flex items-end gap-2">
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

      <div className="mt-5 space-y-2">
        {items.map((c, i) => (
          <SortableRow key={c.id} id={c.id} index={i} onMove={reorder}>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{c.name}</p>
                <p className="text-[11px] text-muted-foreground">/{c.slug}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setEditing(c)}
                  className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => remove(c.id)}
                  aria-label="Excluir"
                  className="grid size-8 place-items-center rounded-md text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </SortableRow>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma categoria cadastrada.</p>}
      </div>
    </section>
  );
}
