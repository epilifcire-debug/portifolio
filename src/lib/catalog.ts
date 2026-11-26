import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { projects as staticProjects } from "@/data/projects";
import { resolveMedia, type MediaRow } from "@/lib/media";

export type CatalogProject = {
  slug: string;
  name: string;
  solutionType: string;
  short: string;
  category: string;
  tags: string[];
  technologies: string[];
  features: string[];
  image?: string | undefined;
  alt?: string | undefined;
  fit?: string | undefined;
  position?: string | undefined;
};

export type CatalogCategory = { slug: string; name: string };

export type Catalog = {
  categories: CatalogCategory[];
  projects: CatalogProject[];
  fromDatabase: boolean;
};

function staticFallback(): Catalog {
  const projects: CatalogProject[] = staticProjects.map((p) => ({
    slug: p.slug,
    name: p.name,
    solutionType: p.category,
    short: p.short,
    category: p.category,
    tags: p.tags,
    technologies: p.technologies,
    features: p.features,
  }));

  const names = Array.from(new Set(projects.map((p) => p.category))).sort();
  return {
    categories: names.map((n) => ({ slug: n, name: n })),
    projects,
    fromDatabase: false,
  };
}

export async function fetchCatalog(): Promise<Catalog> {
  const [projectsRes, categoriesRes] = await Promise.all([
    supabase
      .from("projects")
      .select(
        "slug, name, solution_type, short_description, tags, technologies, card_image, category_id, sort_order, is_featured, featured_order",
      )
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
    supabase.from("categories").select("id, slug, name, sort_order").order("sort_order"),
  ]);

  const rows = projectsRes.data ?? [];
  if (projectsRes.error || rows.length === 0) return staticFallback();

  const catById = new Map((categoriesRes.data ?? []).map((c) => [c.id, c]));

  const slugs = rows.map((r) => r.slug);
  const mediaRes = await supabase
    .from("project_media")
    .select("id, project_slug, url, caption, kind, sort_order, media_kind, alt, fit, position")
    .in("project_slug", slugs)
    .order("sort_order", { ascending: true });

  const resolved = await resolveMedia((mediaRes.data ?? []) as unknown as MediaRow[]);
  const extra = new Map(
    (mediaRes.data ?? []).map((m) => [m.id, m as { media_kind: string; alt: string; fit: string; position: string }]),
  );

  const cardBySlug = new Map<string, (typeof resolved)[number]>();
  for (const m of resolved) {
    const kind = extra.get(m.id)?.media_kind;
    if (kind === "card" && !cardBySlug.has(m.project_slug)) cardBySlug.set(m.project_slug, m);
  }

  const projects: CatalogProject[] = rows.map((r) => {
    const card = cardBySlug.get(r.slug);
    const meta = card ? extra.get(card.id) : undefined;
    const category = r.category_id ? (catById.get(r.category_id)?.name ?? "") : "";
    return {
      slug: r.slug,
      name: r.name,
      solutionType: r.solution_type || "",
      short: r.short_description || "",
      category,
      tags: r.tags ?? [],
      technologies: r.technologies ?? [],
      features: [],
      image: card?.src || r.card_image || undefined,
      alt: meta?.alt || undefined,
      fit: meta?.fit || "contain",
      position: meta?.position || "center",
    };
  });

  const usedCategories = new Set(projects.map((p) => p.category).filter(Boolean));
  const categories = (categoriesRes.data ?? [])
    .filter((c) => usedCategories.has(c.name))
    .map((c) => ({ slug: c.slug, name: c.name }));

  return { categories, projects, fromDatabase: true };
}

export function useCatalog() {
  return useQuery({ queryKey: ["catalog"], queryFn: fetchCatalog, staleTime: 60_000 });
}

export function matchesQuery(p: CatalogProject, q: string) {
  if (!q) return true;
  const haystack = [
    p.name,
    p.solutionType,
    p.short,
    p.category,
    ...p.tags,
    ...p.technologies,
    ...p.features,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}
