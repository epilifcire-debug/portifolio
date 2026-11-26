import { useEffect, useState } from "react";
import { Plus, Save, Trash2, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Technology } from "@/lib/admin";
import { slugify, DEFAULT_LUCIDE_ICONS } from "@/lib/admin";
import { SortableRow } from "./SortableRow";

export function TechnologiesTab({ technologies }: { technologies: Technology[] }) {
  const queryClient = useQueryClient();
  const [items, setItems] = useState<Technology[]>(technologies);
  const [editing, setEditing] = useState<Partial<Technology> | null>(null);

  useEffect(() => {
    setItems(technologies);
  }, [technologies]);

  async function save(tech: Partial<Technology>) {
    const payload = {
      name: tech.name?.trim() ?? "",
      slug: slugify(tech.name?.trim() ?? ""),
      icon: tech.icon?.trim() ?? "",
      category: tech.category?.trim() ?? "",
      description: tech.description?.trim() ?? "",
      is_active: tech.is_active ?? true,
      sort_order: tech.sort_order ?? 0,
    };

    if (!payload.name) {
      toast.error("Informe o nome da tecnologia.");
      return;
    }

    if (tech.id) {
      const { error } = await supabase.from("technologies").update(payload).eq("id", tech.id);
      if (error) {
        toast.error("Não foi possível salvar.");
        return;
      }
    } else {
      const { error } = await supabase.from("technologies").insert(payload);
      if (error) {
        toast.error("Não foi possível criar.");
        return;
      }
    }

    setEditing(null);
    toast.success("Tecnologia salva.");
    queryClient.invalidateQueries({ queryKey: ["admin", "technologies"] });
  }

  async function remove(id: string) {
    if (!confirm("Excluir esta tecnologia?")) return;
    const { error } = await supabase.from("technologies").delete().eq("id", id);
    if (error) {
      toast.error("Não foi possível excluir.");
      return;
    }
    toast.success("Tecnologia excluída.");
    queryClient.invalidateQueries({ queryKey: ["admin", "technologies"] });
  }

  async function reorder(from: number, to: number) {
    const next = [...items];
    const moved = next.splice(from, 1)[0]!;
    next.splice(to, 0, moved);
    setItems(next);

    const updates = next.map((t, i) => ({ id: t.id, sort_order: i }));
    for (const u of updates) {
      await supabase.from("technologies").update({ sort_order: u.sort_order }).eq("id", u.id);
    }
    queryClient.invalidateQueries({ queryKey: ["admin", "technologies"] });
  }

  return (
    <section className="panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Tecnologias</h2>
          <p className="text-xs text-muted-foreground">Tecnologias exibidas na página /tecnologias.</p>
        </div>
        <button
          type="button"
          onClick={() =>
            setEditing({ name: "", slug: "", icon: "", category: "", description: "", is_active: true, sort_order: items.length })
          }
          className="bg-gold-metal inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="size-4" /> Nova tecnologia
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
          <label className="block text-xs text-muted-foreground">
            Ícone Lucide
            <select
              value={editing.icon ?? ""}
              onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
              className="mt-1.5 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60"
            >
              <option value="">Selecione...</option>
              {DEFAULT_LUCIDE_ICONS.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs text-muted-foreground">
            Categoria
            <input
              value={editing.category ?? ""}
              onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              placeholder="Frontend, Backend, Infra..."
              className="mt-1.5 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60"
            />
          </label>
          <label className="block text-xs text-muted-foreground sm:col-span-2">
            Descrição
            <input
              value={editing.description ?? ""}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              className="mt-1.5 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={editing.is_active ?? true}
              onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
              className="size-4 rounded border-border"
            />
            Ativa
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

      <div className="mt-5 space-y-2">
        {items.map((t, i) => (
          <SortableRow key={t.id} id={t.id} index={i} onMove={reorder}>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {t.name} <span className="text-xs text-muted-foreground">({t.icon || "sem ícone"})</span>
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {t.category} • {t.is_active ? "Ativa" : "Inativa"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setEditing(t)}
                  className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => remove(t.id)}
                  aria-label="Excluir"
                  className="grid size-8 place-items-center rounded-md text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </SortableRow>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma tecnologia cadastrada.</p>}
      </div>
    </section>
  );
}
