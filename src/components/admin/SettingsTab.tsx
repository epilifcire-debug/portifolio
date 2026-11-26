import { useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { ContactSetting, SiteMetric, SiteSetting } from "@/lib/admin";
import { EmailPreviewCard } from "./EmailPreviewCard";


export function SettingsTab({
  contact,
  metrics,
  settings,
  isAdminMaster,
}: {
  contact: ContactSetting;
  metrics: SiteMetric[];
  settings: SiteSetting;
  isAdminMaster: boolean;
}) {
  const queryClient = useQueryClient();
  const [contactForm, setContactForm] = useState({ ...contact });
  const [settingsForm, setSettingsForm] = useState({ ...settings });
  const [metricsForm, setMetricsForm] = useState<SiteMetric[]>([...metrics]);
  const [deletedMetricIds, setDeletedMetricIds] = useState<string[]>([]);
  const [saving, setSaving] = useState<"contact" | "metrics" | "signature" | null>(null);

  async function saveContact() {
    setSaving("contact");
    const { error } = await supabase.from("contact_settings").upsert({ ...contactForm, id: "default" });
    if (error) toast.error("Não foi possível salvar contato.");
    else {
      toast.success("Contato salvo.");
      queryClient.invalidateQueries({ queryKey: ["admin", "contact"] });
    }
    setSaving(null);
  }

  async function saveMetrics() {
    setSaving("metrics");
    if (deletedMetricIds.length > 0) {
      await supabase.from("site_metrics").delete().in("id", deletedMetricIds);
    }
    for (const m of metricsForm) {
      if (m.id) {
        await supabase.from("site_metrics").update({ label: m.label, value: m.value, sort_order: m.sort_order, is_active: m.is_active }).eq("id", m.id);
      } else {
        await supabase.from("site_metrics").insert({ label: m.label, value: m.value, sort_order: m.sort_order, is_active: m.is_active });
      }
    }
    setDeletedMetricIds([]);
    toast.success("Métricas salvas.");
    queryClient.invalidateQueries({ queryKey: ["admin", "metrics"] });
    setSaving(null);
  }

  async function saveSignature() {
    setSaving("signature");
    const { error } = await supabase.from("site_settings").upsert({ ...settingsForm, id: "default" });
    if (error) toast.error("Não foi possível salvar assinatura.");
    else {
      toast.success("Assinatura salva.");
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    }
    setSaving(null);
  }

  function addMetric() {
    setMetricsForm((prev) => [
      ...prev,
      { id: "", label: "", value: "", sort_order: prev.length, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    ]);
  }

  function removeMetric(index: number) {
    const removed = metricsForm[index];
    if (removed?.id) {
      setDeletedMetricIds((prev) => [...prev, removed.id]);
    }
    setMetricsForm((prev) => prev.filter((_, i) => i !== index));
  }

  const inputClass =
    "mt-1.5 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60";
  const labelClass = "block text-xs text-muted-foreground";

  return (
    <div className="space-y-6">
      <section className="panel p-6">
        <h2 className="text-lg font-bold text-foreground">Contato</h2>
        <p className="text-xs text-muted-foreground">WhatsApp, e-mail e redes sociais exibidas no site.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            ["whatsapp", "WhatsApp"] as const,
            ["email", "E-mail"] as const,
            ["linkedin", "LinkedIn"] as const,
            ["github", "GitHub"] as const,
            ["calendly", "Calendly (link de agendamento)"] as const,
          ].map(([key, label]) => (
            <label key={key} className={labelClass}>
              {label}
              <input
                value={(contactForm[key] as string) ?? ""}
                onChange={(e) => setContactForm({ ...contactForm, [key]: e.target.value })}
                className={inputClass}
              />
            </label>
          ))}
        </div>
        <button
          type="button"
          disabled={saving === "contact"}
          onClick={saveContact}
          className="bg-gold-metal mt-5 inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          <Save className="size-4" /> {saving === "contact" ? "Salvando..." : "Salvar contato"}
        </button>
      </section>

      <section className="panel p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Métricas do site</h2>
            <p className="text-xs text-muted-foreground">Destaques numéricos exibidos na home.</p>
          </div>
          <button
            type="button"
            onClick={addMetric}
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary/60"
          >
            <Plus className="size-3.5" /> Adicionar
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {metricsForm.map((m, i) => (
            <div key={i} className="grid gap-2 rounded-lg border border-border bg-card/60 p-3 sm:grid-cols-4">
              <input
                value={m.label}
                onChange={(e) => {
                  const next = [...metricsForm];
                  next[i] = { ...next[i]!, label: e.target.value };
                  setMetricsForm(next);
                }}
                placeholder="Rótulo"
                className={inputClass}
              />
              <input
                value={m.value}
                onChange={(e) => {
                  const next = [...metricsForm];
                  next[i] = { ...next[i]!, value: e.target.value };
                  setMetricsForm(next);
                }}
                placeholder="Valor"
                className={inputClass}
              />
              <input
                type="number"
                value={m.sort_order}
                onChange={(e) => {
                  const next = [...metricsForm];
                  next[i] = { ...next[i]!, sort_order: Number(e.target.value) };
                  setMetricsForm(next);
                }}
                placeholder="Ordem"
                className={inputClass}
              />
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={m.is_active}
                    onChange={(e) => {
                      const next = [...metricsForm];
                      next[i] = { ...next[i]!, is_active: e.target.checked };
                      setMetricsForm(next);
                    }}
                    className="size-4 rounded border-border"
                  />
                  Ativo
                </label>
                <button
                  type="button"
                  onClick={() => removeMetric(i)}
                  className="ml-auto grid size-7 place-items-center rounded-md text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          disabled={saving === "metrics"}
          onClick={saveMetrics}
          className="bg-gold-metal mt-5 inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          <Save className="size-4" /> {saving === "metrics" ? "Salvando..." : "Salvar métricas"}
        </button>
      </section>

      <section className={`panel p-6 ${!isAdminMaster ? "opacity-60" : ""}`}>
        <h2 className="text-lg font-bold text-foreground">Assinatura EFCSYS</h2>
        <p className="text-xs text-muted-foreground">Imagem e texto alternativo da assinatura oficial.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            URL da assinatura
            <input
              value={settingsForm.signature_url ?? ""}
              onChange={(e) => setSettingsForm({ ...settingsForm, signature_url: e.target.value })}
              disabled={!isAdminMaster}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Texto alternativo
            <input
              value={settingsForm.signature_alt ?? ""}
              onChange={(e) => setSettingsForm({ ...settingsForm, signature_alt: e.target.value })}
              disabled={!isAdminMaster}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Texto institucional
            <textarea
              value={settingsForm.institutional_text ?? ""}
              onChange={(e) => setSettingsForm({ ...settingsForm, institutional_text: e.target.value })}
              disabled={!isAdminMaster}
              rows={3}
              className={inputClass}
            />
          </label>
        </div>
        <button
          type="button"
          disabled={!isAdminMaster || saving === "signature"}
          onClick={saveSignature}
          className="bg-gold-metal mt-5 inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          <Save className="size-4" /> {saving === "signature" ? "Salvando..." : "Salvar assinatura"}
        </button>
        {!isAdminMaster && <p className="mt-2 text-xs text-destructive">Apenas o Admin Master pode editar a assinatura.</p>}
      </section>

      <EmailPreviewCard />
    </div>

  );
}
