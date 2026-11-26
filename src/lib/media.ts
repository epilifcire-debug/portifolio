import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const HERO_SLUG = "__home_hero__";
export const BUCKET = "project-media";

export type MediaRow = {
  id: string;
  project_slug: string;
  url: string;
  caption: string;
  kind: string;
  sort_order: number;
};

export type ResolvedMedia = MediaRow & { src: string };

const isExternal = (value: string) => /^https?:\/\//i.test(value);

export async function resolveMedia(rows: MediaRow[]): Promise<ResolvedMedia[]> {
  const paths = rows.filter((r) => !isExternal(r.url)).map((r) => r.url);
  const signed = new Map<string, string>();

  if (paths.length > 0) {
    const { data } = await supabase.storage.from(BUCKET).createSignedUrls(paths, 60 * 60 * 24 * 7);
    data?.forEach((item) => {
      if (item.path && item.signedUrl) signed.set(item.path, item.signedUrl);
    });
  }

  return rows.map((row) => ({
    ...row,
    src: isExternal(row.url) ? row.url : (signed.get(row.url) ?? ""),
  }));
}

export async function fetchMedia(slug?: string): Promise<ResolvedMedia[]> {
  let query = supabase
    .from("project_media")
    .select("id, project_slug, url, caption, kind, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (slug) query = query.eq("project_slug", slug);

  const { data, error } = await query;
  if (error) throw error;
  return resolveMedia((data ?? []) as MediaRow[]);
}

export function useProjectMedia(slug: string) {
  return useQuery({
    queryKey: ["project-media", slug],
    queryFn: () => fetchMedia(slug),
    staleTime: 60_000,
  });
}

export function useAllMedia() {
  return useQuery({
    queryKey: ["project-media", "all"],
    queryFn: () => fetchMedia(),
  });
}

export type ContactSettings = {
  whatsapp: string;
  email: string;
  linkedin: string;
  github: string;
  calendly: string;
};

export const emptyContact: ContactSettings = {
  whatsapp: "",
  email: "",
  linkedin: "",
  github: "",
  calendly: "",
};

export function buildWhatsAppHref(whatsapp: string, message: string): string {
  const base = /^https?:\/\//i.test(whatsapp)
    ? whatsapp
    : `https://wa.me/${whatsapp.replace(/\D/g, "")}`;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}text=${encodeURIComponent(message)}`;
}

export async function fetchContactSettings(): Promise<ContactSettings> {
  const { data, error } = await supabase
    .from("contact_settings")
    .select("whatsapp, email, linkedin, github, calendly")
    .eq("id", "default")
    .maybeSingle();
  if (error) throw error;
  return { ...emptyContact, ...((data as Partial<ContactSettings> | null) ?? {}) };
}

export function useContactSettings() {
  return useQuery({
    queryKey: ["contact-settings"],
    queryFn: fetchContactSettings,
    staleTime: 60_000,
  });
}
