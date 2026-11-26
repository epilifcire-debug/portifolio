import { FolderKanban, Tags, Cpu, Image as ImageIcon, Settings } from "lucide-react";
import type { Category, Technology, ProjectWithCategory, SiteMetric, SiteSetting } from "@/lib/admin";

export function DashboardTab({
  projects,
  categories,
  technologies,
  mediaCount,
  metrics,
  settings,
  isMaster,
}: {
  projects: ProjectWithCategory[];
  categories: Category[];
  technologies: Technology[];
  mediaCount: number;
  metrics: SiteMetric[];
  settings: SiteSetting | null;
  isMaster: boolean;
}) {
  const published = projects.filter((p) => p.is_published && !p.is_archived).length;
  const featured = projects.filter((p) => p.is_featured).length;
  const archived = projects.filter((p) => p.is_archived).length;

  return (
    <div className="space-y-6">
      <section className="panel p-6">
        <h2 className="text-lg font-bold text-foreground">Visão geral</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-secondary/30 p-4">
            <p className="text-2xl font-bold text-foreground">{projects.length}</p>
            <p className="text-xs text-muted-foreground">Projetos cadastrados</p>
          </div>
          <div className="rounded-xl border border-border bg-secondary/30 p-4">
            <p className="text-2xl font-bold text-foreground">{published}</p>
            <p className="text-xs text-muted-foreground">Projetos publicados</p>
          </div>
          <div className="rounded-xl border border-border bg-secondary/30 p-4">
            <p className="text-2xl font-bold text-foreground">{featured}</p>
            <p className="text-xs text-muted-foreground">Projetos em destaque</p>
          </div>
          <div className="rounded-xl border border-border bg-secondary/30 p-4">
            <p className="text-2xl font-bold text-foreground">{archived}</p>
            <p className="text-xs text-muted-foreground">Arquivados</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="panel p-6">
          <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Tags className="size-4 text-primary" /> Categorias
          </h3>
          <p className="mt-1 text-2xl font-bold text-foreground">{categories.length}</p>
        </section>
        <section className="panel p-6">
          <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Cpu className="size-4 text-primary" /> Tecnologias
          </h3>
          <p className="mt-1 text-2xl font-bold text-foreground">{technologies.length}</p>
        </section>
        <section className="panel p-6">
          <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <ImageIcon className="size-4 text-primary" /> Mídias
          </h3>
          <p className="mt-1 text-2xl font-bold text-foreground">{mediaCount}</p>
        </section>
      </div>

      <section className="panel p-6">
        <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Settings className="size-4 text-primary" /> Configurações
        </h3>
        <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
          <li>Assinatura EFCSYS configurada: {settings?.signature_url ? "Sim" : "Não"}</li>
          <li>Texto institucional: {settings?.institutional_text ? "Sim" : "Não"}</li>
          <li>Indicadores ativos: {metrics.filter((m) => m.is_active).length}</li>
          <li>Você é Admin Master: {isMaster ? "Sim" : "Não"}</li>
        </ul>
      </section>
    </div>
  );
}
