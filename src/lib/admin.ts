import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Project = Tables<"projects">;
export type Category = Tables<"categories">;
export type Technology = Tables<"technologies">;
export type ProjectFeature = Tables<"project_features">;
export type ProjectMedia = Tables<"project_media">;
export type SiteMetric = Tables<"site_metrics">;
export type SiteSetting = Tables<"site_settings">;
export type ContactSetting = Tables<"contact_settings"> & { calendly?: string };

export type ProjectWithCategory = Project & { category: Category | null };

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function isAdminMaster(): Promise<boolean> {
  const { data, error } = await supabase.rpc("is_admin_master");
  if (error) return false;
  return !!data;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Category[];
}

export async function fetchTechnologies(): Promise<Technology[]> {
  const { data, error } = await supabase
    .from("technologies")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Technology[];
}

export async function fetchProjects(): Promise<ProjectWithCategory[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*, category:categories(*)")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ProjectWithCategory[];
}

export async function fetchProjectFeatures(projectId: string): Promise<ProjectFeature[]> {
  const { data, error } = await supabase
    .from("project_features")
    .select("*")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ProjectFeature[];
}

export async function fetchProjectMedia(projectId: string): Promise<ProjectMedia[]> {
  const { data, error } = await supabase
    .from("project_media")
    .select("*")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ProjectMedia[];
}

export async function fetchSiteMetrics(): Promise<SiteMetric[]> {
  const { data, error } = await supabase
    .from("site_metrics")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as SiteMetric[];
}

export async function fetchSiteSettings(): Promise<SiteSetting | null> {
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", "default").maybeSingle();
  if (error) throw error;
  return data as SiteSetting | null;
}

export async function fetchContactSettings(): Promise<ContactSetting | null> {
  const { data, error } = await supabase.from("contact_settings").select("*").eq("id", "default").maybeSingle();
  if (error) throw error;
  return data as ContactSetting | null;
}

export const PROJECT_STATUS_LABELS: Record<Project["status"], string> = {
  producao: "Em produção",
  concluido: "Concluído",
  desenvolvimento: "Em desenvolvimento",
  demonstrativo: "Demonstrativo",
  arquivado: "Arquivado",
};

export const MEDIA_KIND_LABELS: Record<ProjectMedia["media_kind"], string> = {
  card: "Imagem do card",
  hero: "Imagem do Hero",
  gallery_desktop: "Galeria desktop",
  gallery_mobile: "Galeria mobile",
  og: "OG Image",
};

export const DEFAULT_LUCIDE_ICONS = [
  "Check",
  "Calendar",
  "Users",
  "BarChart3",
  "Bell",
  "CreditCard",
  "FileText",
  "Image",
  "LayoutDashboard",
  "MessageSquare",
  "Package",
  "QrCode",
  "Settings",
  "Shield",
  "Smartphone",
  "Tablet",
  "Monitor",
  "TrendingUp",
  "Truck",
  "Wallet",
  "Zap",
];
