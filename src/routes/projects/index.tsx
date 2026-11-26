import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import CircuitBackground from "@/components/CircuitBackground";
import ProjectCatalogCard from "@/components/ProjectCatalogCard";
import { matchesQuery, useCatalog } from "@/lib/catalog";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projetos | EFC Tecnologia" },
      {
        name: "description",
        content:
          "Aplicativos, sistemas e soluções digitais desenvolvidos pela EFC Tecnologia.",
      },
      { property: "og:title", content: "Projetos | EFC Tecnologia" },
      {
        property: "og:description",
        content: "Aplicativos, sistemas e soluções digitais desenvolvidos pela EFC Tecnologia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { data, isLoading } = useCatalog();
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");

  const projects = data?.projects ?? [];
  const categories = useMemo(
    () => ["Todos", ...(data?.categories ?? []).map((c) => c.name)],
    [data],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchCat =
        category === "Todos" || p.category === category || p.tags.includes(category);
      return matchCat && matchesQuery(p, q);
    });
  }, [projects, category, query]);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border/60">
        <CircuitBackground />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <h1 className="font-display text-3xl text-foreground sm:text-4xl">Projetos</h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Aplicativos, sistemas e soluções digitais desenvolvidos pela EFC Tecnologia.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar projeto ou solução"
            aria-label="Buscar projeto ou solução"
            className="w-full rounded-md border border-input bg-card/60 py-2.5 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/60"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`min-h-9 rounded-md border px-3 py-1.5 text-xs transition-all duration-200 active:scale-95 ${
                category === c
                  ? "border-primary/70 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div
          key={`${category}-${query}`}
          className="mt-8 grid animate-in fade-in zoom-in-95 gap-5 duration-300 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((p) => (
            <ProjectCatalogCard key={p.slug} project={p} />
          ))}
        </div>

        {isLoading && (
          <p className="mt-12 text-center text-sm text-muted-foreground">Carregando projetos...</p>
        )}

        {!isLoading && filtered.length === 0 && (
          <p className="mt-12 text-center text-sm text-muted-foreground">
            Nenhum projeto encontrado para esta busca.
          </p>
        )}
      </section>
    </div>
  );
}
