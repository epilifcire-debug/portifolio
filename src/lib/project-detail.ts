import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { projects as staticProjects, getProject } from "@/data/projects";
import { resolveMedia, type MediaRow } from "@/lib/media";

export type DetailImage = {
  src?: string | undefined;
  caption: string;
  alt?: string | undefined;
  fit?: string | undefined;
  position?: string | undefined;
  mediaKind?: string | undefined;
};

export type DetailFeature = { icon: string; title: string; description: string };

export type ProjectDetail = {
  slug: string;
  name: string;
  solutionType: string;
  category: string;
  short: string;
  description: string;
  about: string;
  challenge: string;
  solution: string;
  results: string;
  tags: string[];
  technologies: string[];
  features: DetailFeature[];
  hero?: DetailImage | undefined;
  gallery: DetailImage[];
  publicUrl: string;
  demoUrl: string;
  status: string;
  show: {
    accessButton: boolean;
    technologies: boolean;
    challenge: boolean;
    solution: boolean;
    results: boolean;
  };
  next?: { slug: string; name: string; solutionType: string; image?: string | undefined } | undefined;
};

function staticDetail(slug: string): ProjectDetail | null {
  const p = getProject(slug);
  if (!p) return null;
  const idx = staticProjects.findIndex((s) => s.slug === slug);
  const nx = staticProjects[(idx + 1) % staticProjects.length];
  return {
    slug: p.slug,
    name: p.name,
    solutionType: p.category,
    category: p.category,
    short: p.short,
    description: p.description,
    about: "",
    challenge: p.challenge,
    solution: p.solution,
    results: "",
    tags: p.tags,
    technologies: p.technologies,
    features: p.features.map((f) => ({ icon: "check", title: f, description: "" })),
    gallery: p.gallery.map((g) => ({ caption: g.caption })),
    publicUrl: "",
    demoUrl: p.demoUrl ?? "",
    status: "",
    show: {
      accessButton: true,
      technologies: true,
      challenge: true,
      solution: true,
      results: false,
    },
    next:
      nx && nx.slug !== p.slug
        ? { slug: nx.slug, name: nx.name, solutionType: nx.category }
        : undefined,
  };
}

export async function fetchProjectDetail(slug: string): Promise<ProjectDetail | null> {
  const { data: row, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .eq("is_archived", false)
    .maybeSingle();

  if (error || !row) return staticDetail(slug);

  const [featuresRes, mediaRes, catRes, siblingsRes] = await Promise.all([
    supabase
      .from("project_features")
      .select("icon, title, description, sort_order")
      .eq("project_id", row.id)
      .order("sort_order"),
    supabase
      .from("project_media")
      .select("id, project_slug, url, caption, kind, sort_order, media_kind, alt, fit, position")
      .eq("project_slug", slug)
      .order("sort_order"),
    row.category_id
      ? supabase.from("categories").select("name").eq("id", row.category_id).maybeSingle()
      : Promise.resolve({ data: null } as { data: { name: string } | null }),
    supabase
      .from("projects")
      .select("slug, name, solution_type, card_image, sort_order")
      .eq("is_published", true)
      .eq("is_archived", false)
      .order("sort_order"),
  ]);

  const mediaRows = (mediaRes.data ?? []) as unknown as (MediaRow & {
    media_kind: string;
    alt: string;
    fit: string;
    position: string;
  })[];
  const resolved = await resolveMedia(mediaRows);
  const byId = new Map(mediaRows.map((m) => [m.id, m]));

  const images: DetailImage[] = resolved.map((m) => {
    const meta = byId.get(m.id);
    return {
      src: m.src,
      caption: m.caption,
      alt: meta?.alt || undefined,
      fit: meta?.fit || "contain",
      position: meta?.position || "center",
      mediaKind: meta?.media_kind || m.kind,
    };
  });

  const hero =
    images.find((i) => i.mediaKind === "hero") ??
    images.find((i) => i.mediaKind === "mockup") ??
    (row.hero_image ? { src: row.hero_image, caption: row.name } : undefined) ??
    images.find((i) => i.mediaKind === "card");

  const gallery = images.filter(
    (i) => i.mediaKind !== "hero" && i.mediaKind !== "card" && i.mediaKind !== "og",
  );

  const siblings = siblingsRes.data ?? [];
  const idx = siblings.findIndex((s) => s.slug === slug);
  const nx = idx >= 0 ? siblings[(idx + 1) % siblings.length] : undefined;

  return {
    slug: row.slug,
    name: row.name,
    solutionType: row.solution_type || "",
    category: catRes.data?.name || "",
    short: row.short_description || "",
    description: row.description || "",
    about: row.about || "",
    challenge: row.challenge || "",
    solution: row.solution || "",
    results: row.results || "",
    tags: row.tags ?? [],
    technologies: row.technologies ?? [],
    features: (featuresRes.data ?? []).map((f) => ({
      icon: f.icon || "check",
      title: f.title,
      description: f.description || "",
    })),
    hero,
    gallery,
    publicUrl: row.public_url || "",
    demoUrl: row.demo_url || "",
    status: row.status || "",
    show: {
      accessButton: row.show_access_button,
      technologies: row.show_technologies,
      challenge: row.show_challenge,
      solution: row.show_solution,
      results: row.show_results,
    },
    next:
      nx && nx.slug !== slug
        ? {
            slug: nx.slug,
            name: nx.name,
            solutionType: nx.solution_type || "",
            image: nx.card_image || undefined,
          }
        : undefined,
  };
}

export function useProjectDetail(slug: string) {
  return useQuery({
    queryKey: ["project-detail", slug],
    queryFn: () => fetchProjectDetail(slug),
    staleTime: 60_000,
  });
}
