import { useState } from "react";
import { LayoutDashboard, FolderKanban, Tags, Cpu, Image as ImageIcon, Mail, Settings, LogOut, MessageSquareQuote, Newspaper } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export type AdminTab =
  | "dashboard"
  | "projects"
  | "categories"
  | "technologies"
  | "media"
  | "testimonials"
  | "articles"
  | "messages"
  | "settings";

const TABS: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "projects", label: "Projetos", icon: FolderKanban },
  { id: "categories", label: "Categorias", icon: Tags },
  { id: "technologies", label: "Tecnologias", icon: Cpu },
  { id: "media", label: "Mídia", icon: ImageIcon },
  { id: "testimonials", label: "Depoimentos", icon: MessageSquareQuote },
  { id: "articles", label: "Artigos", icon: Newspaper },
  { id: "messages", label: "Mensagens", icon: Mail },
  { id: "settings", label: "Configurações", icon: Settings },
];

export function AdminShell({
  activeTab,
  onTabChange,
  children,
}: {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Sidebar / mobile tabs */}
        <aside className="lg:w-64 lg:shrink-0">
          <div className="panel p-4">
            <div className="flex items-center justify-between lg:block">
              <div>
                <h1 className="text-xl font-bold text-foreground">Admin</h1>
                <p className="text-xs text-muted-foreground">EFC Tecnologia</p>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="rounded-md border border-border px-3 py-1.5 text-xs text-foreground lg:hidden"
              >
                {mobileOpen ? "Fechar" : "Menu"}
              </button>
            </div>

            <nav className={`mt-4 space-y-1 ${mobileOpen ? "block" : "hidden lg:block"}`}>
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      onTabChange(tab.id);
                      setMobileOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-4" />
                    {tab.label}
                  </button>
                );
              })}

              <hr className="my-3 border-border" />

              <Link
                to="/"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                ← Ver site
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <LogOut className="size-4" /> Sair
              </button>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
