import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell, type AdminTab } from "@/components/admin/AdminShell";
import { DashboardTab } from "@/components/admin/DashboardTab";
import { CategoriesTab } from "@/components/admin/CategoriesTab";
import { TechnologiesTab } from "@/components/admin/TechnologiesTab";
import { ProjectsTab } from "@/components/admin/ProjectsTab";
import { MediaTab } from "@/components/admin/MediaTab";
import { MessagesTab } from "@/components/admin/MessagesTab";
import { SettingsTab } from "@/components/admin/SettingsTab";
import { TestimonialsTab } from "@/components/admin/TestimonialsTab";
import { ArticlesTab } from "@/components/admin/ArticlesTab";
import {
  fetchCategories,
  fetchContactSettings,
  fetchProjects,
  fetchSiteMetrics,
  fetchSiteSettings,
  fetchTechnologies,
  isAdminMaster,
} from "@/lib/admin";
import { useAllMedia } from "@/lib/media";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel administrativo | EFC Tecnologia" },
      { name: "description", content: "Configuração completa do portfólio EFC Tecnologia." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [tab, setTab] = useState<AdminTab>("dashboard");

  const categoriesQuery = useQuery({ queryKey: ["admin", "categories"], queryFn: fetchCategories });
  const technologiesQuery = useQuery({ queryKey: ["admin", "technologies"], queryFn: fetchTechnologies });
  const projectsQuery = useQuery({ queryKey: ["admin", "projects"], queryFn: fetchProjects });
  const mediaQuery = useAllMedia();
  const metricsQuery = useQuery({ queryKey: ["admin", "metrics"], queryFn: fetchSiteMetrics });
  const settingsQuery = useQuery({ queryKey: ["admin", "settings"], queryFn: fetchSiteSettings });
  const contactQuery = useQuery({ queryKey: ["admin", "contact"], queryFn: fetchContactSettings });
  const masterQuery = useQuery({ queryKey: ["admin", "master"], queryFn: isAdminMaster });

  const categories = categoriesQuery.data ?? [];
  const technologies = technologiesQuery.data ?? [];
  const projects = projectsQuery.data ?? [];
  const media = mediaQuery.data ?? [];
  const metrics = metricsQuery.data ?? [];
  const settings = settingsQuery.data ?? null;
  const contact = contactQuery.data ?? {
    id: "default",
    whatsapp: "",
    email: "",
    linkedin: "",
    github: "",
    calendly: "",
    updated_at: new Date().toISOString(),
  };
  const isMaster = masterQuery.data ?? false;

  const isLoading =
    categoriesQuery.isLoading ||
    technologiesQuery.isLoading ||
    projectsQuery.isLoading ||
    metricsQuery.isLoading ||
    settingsQuery.isLoading ||
    contactQuery.isLoading ||
    masterQuery.isLoading;

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-12 text-sm text-muted-foreground sm:px-6">
        Carregando painel...
      </div>
    );
  }

  return (
    <AdminShell activeTab={tab} onTabChange={setTab}>
      {tab === "dashboard" && (
        <DashboardTab
          projects={projects}
          categories={categories}
          technologies={technologies}
          mediaCount={media.length}
          metrics={metrics}
          settings={settings}
          isMaster={isMaster}
        />
      )}
      {tab === "projects" && <ProjectsTab projects={projects} categories={categories} />}
      {tab === "categories" && <CategoriesTab categories={categories} />}
      {tab === "technologies" && <TechnologiesTab technologies={technologies} />}
      {tab === "media" && <MediaTab projects={projects} />}
      {tab === "testimonials" && <TestimonialsTab />}
      {tab === "articles" && <ArticlesTab />}
      {tab === "messages" && <MessagesTab />}
      {tab === "settings" && (
        <SettingsTab
          contact={contact}
          metrics={metrics}
          settings={settings ?? { id: "default", signature_url: "", signature_alt: "", institutional_text: "", updated_at: new Date().toISOString() }}
          isAdminMaster={isMaster}
        />
      )}
    </AdminShell>
  );
}
