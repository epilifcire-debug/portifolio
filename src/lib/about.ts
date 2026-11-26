import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type AboutData = {
  institutionalText: string;
  signatureAlt: string;
  signatureUrl: string;
  metrics: { label: string; value: string; sort_order: number }[];
};

function createPublicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const getAboutData = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createPublicClient();

  const [{ data: settings, error: settingsError }, { data: metrics, error: metricsError }] =
    await Promise.all([
      supabase.from("site_settings").select("*").eq("id", "default").maybeSingle(),
      supabase.from("site_metrics").select("label, value, sort_order").eq("is_active", true).order("sort_order", { ascending: true }),
    ]);

  // Falha de banco não derruba a página institucional: usa o texto padrão.
  if (settingsError || metricsError) {
    console.error("[about] falha ao carregar conteúdo institucional", settingsError ?? metricsError);
    return {
      institutionalText: "",
      signatureAlt: "EFC Tecnologia by EFCSYS — Soluções que conectam o seu futuro",
      signatureUrl: "",
      metrics: [],
    } satisfies AboutData;
  }

  return {
    institutionalText: settings?.institutional_text || "",
    signatureAlt: settings?.signature_alt || "EFC Tecnologia by EFCSYS — Soluções que conectam o seu futuro",
    signatureUrl: settings?.signature_url || "",
    metrics: metrics ?? [],
  } satisfies AboutData;
});
