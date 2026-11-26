import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Testimonial = Tables<"testimonials">;
export type Article = Tables<"articles">;

export async function fetchPublishedTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Testimonial[];
}

export function useTestimonials() {
  return useQuery({ queryKey: ["testimonials", "public"], queryFn: fetchPublishedTestimonials });
}

export async function fetchPublishedArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Article[];
}

export function useArticles() {
  return useQuery({ queryKey: ["articles", "public"], queryFn: fetchPublishedArticles });
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) throw error;
  return (data as Article | null) ?? null;
}

export function useArticle(slug: string) {
  return useQuery({ queryKey: ["articles", "public", slug], queryFn: () => fetchArticleBySlug(slug) });
}

/** Splits plain text content into blocks: `## title` becomes a heading. */
export function parseArticleBlocks(content: string) {
  return content
    .split(/\n{2,}/)
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((block) =>
      block.startsWith("## ")
        ? ({ type: "heading" as const, text: block.slice(3).trim() })
        : ({ type: "paragraph" as const, text: block }),
    );
}

export function formatArticleDate(value: string): string {
  try {
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(
      new Date(value),
    );
  } catch {
    return "";
  }
}
