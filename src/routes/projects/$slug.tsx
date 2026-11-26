import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ChevronRight, Check } from "lucide-react";
import CircuitBackground from "@/components/CircuitBackground";
import ProjectGallery from "@/components/ProjectGallery";
import { ProjectThumb } from "@/components/ProjectCard";
import { getProject } from "@/data/projects";
import { useProjectDetail } from "@/lib/project-detail";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return project;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} | EFC Tecnologia` },
          { name: "description", content: loaderData.short },
          { property: "og:title", content: `${loaderData.name} | EFC Tecnologia` },
          { property: "og:description", content: loaderData.short },
          { property: "og:type", content: "article" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Projeto | EFC Tecnologia" }, { name: "robots", content: "noindex" }],
    scripts: loaderData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              name: loaderData.name,
              description: loaderData.short,
              url: `https://efcsys.com/projects/${loaderData.slug}`,
              creator: { "@type": "Organization", name: "EFC Tecnologia" },
            }),
          },
        ]
      : [],
  }),
  component: ProjectPage,
});

function ProjectPage() {
  const staticProject = Route.useLoaderData();
  const detail = useProjectDetail(staticProject.slug).data;

  const p = detail ?? {
    slug: staticProject.slug,
    name: staticProject.name,
    solutionType: staticProject.category,
    category: staticProject.category,
    short: staticProject.short,
    description: staticProject.description,
    about: "",
    challenge: staticProject.challenge,
    solution: staticProject.solution,
    results: "",
    tags: staticProject.tags,
    technologies: staticProject.technologies,
    features: staticProject.features.map((f) => ({ icon: "check", title: f, description: "" })),
    hero: undefined,
    gallery: staticProject.gallery.map((g) => ({ caption: g.caption })),
    publicUrl: "",
    demoUrl: staticProject.demoUrl ?? "",
    status: "",
    show: {
      accessButton: true,
      technologies: true,
      challenge: true,
      solution: true,
      results: false,
    },
    next: undefined,
  };

  const accessUrl = p.show.accessButton ? p.publicUrl || p.demoUrl : "";

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <CircuitBackground />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-label="Trilha">
            <Link to="/projects" className="hover:text-primary">
              Projetos
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-foreground">{p.name}</span>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
            <div>
              {p.category && (
                <p className="text-[11px] uppercase tracking-[0.25em] text-primary">{p.category}</p>
              )}
              <h1 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">{p.name}</h1>
              {p.solutionType && (
                <p className="mt-2 text-sm font-medium text-silver">{p.solutionType}</p>
              )}
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
                {p.description || p.short}
              </p>
              {p.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-primary/60 hover:text-primary"
                >
                  <ArrowLeft className="size-3.5" /> Voltar para projetos
                </Link>
                {accessUrl && (
                  <a
                    href={accessUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gold-metal inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-primary-foreground"
                  >
                    Acessar sistema
                  </a>
                )}
              </div>
            </div>

            {p.hero?.src ? (
              <img
                src={p.hero.src}
                alt={p.hero.alt || `${p.name} — ${p.hero.caption}`}
                decoding="async"
                fetchPriority="high"
                className="aspect-[16/10] w-full rounded-xl border border-border/70 shadow-[var(--shadow-panel)]"
                style={{
                  objectFit: (p.hero.fit as "contain" | "cover") || "contain",
                  objectPosition: p.hero.position || "center",
                }}
              />
            ) : (
              <ProjectThumb name={p.name} className="aspect-[16/10] w-full" />
            )}
          </div>
        </div>
      </section>

      {/* SOBRE O PROJETO */}
      {(p.about || p.description) && (
        <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="text-lg font-bold text-foreground">Sobre o projeto</h2>
          <p className="mt-4 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {p.about || p.description}
          </p>
        </section>
      )}

      {/* DESAFIO / SOLUÇÃO */}
      {((p.show.challenge && p.challenge) || (p.show.solution && p.solution)) && (
        <section className="mx-auto grid w-full max-w-6xl gap-5 px-4 pb-12 sm:px-6 lg:grid-cols-2">
          {p.show.challenge && p.challenge && (
            <div className="panel p-7">
              <h2 className="text-lg font-bold text-foreground">O desafio</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.challenge}</p>
            </div>
          )}
          {p.show.solution && p.solution && (
            <div className="panel p-7">
              <h2 className="text-lg font-bold text-foreground">A solução</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.solution}</p>
            </div>
          )}
        </section>
      )}

      {/* RESULTADOS */}
      {p.show.results && p.results && (
        <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6">
          <div className="panel p-7">
            <h2 className="text-lg font-bold text-foreground">Resultados</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {p.results}
            </p>
          </div>
        </section>
      )}

      {/* FUNCIONALIDADES */}
      {p.features.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6">
          <h2 className="text-lg font-bold text-foreground">Principais funcionalidades</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {p.features.map((f) => (
              <div key={f.title} className="panel panel-hover flex items-start gap-3 p-4">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                <div>
                  <span className="text-sm text-foreground">{f.title}</span>
                  {f.description && (
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {f.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* GALERIA */}
      {p.gallery.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6">
          <h2 className="text-lg font-bold text-foreground">Conheça o sistema</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Telas reais do sistema. Clique em qualquer imagem para ampliar.
          </p>
          <div className="mt-6">
            <ProjectGallery items={p.gallery} name={p.name} />
          </div>
        </section>
      )}

      {/* TECNOLOGIAS — depois de problema, solução, funcionalidades e interfaces */}
      {p.show.technologies && p.technologies.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6">
          <h2 className="text-lg font-bold text-foreground">Tecnologias utilizadas</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {p.technologies.map((t) => (
              <span
                key={t}
                className="rounded-md border border-border bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* PRÓXIMO PROJETO */}
      {p.next && (
        <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6">
          <h2 className="text-lg font-bold text-foreground">Próximo projeto</h2>
          <Link
            to="/projects/$slug"
            params={{ slug: p.next.slug }}
            className="panel group mt-5 flex flex-col gap-4 overflow-hidden p-4 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-primary/60 sm:flex-row sm:items-center"
          >
            <div className="aspect-[16/10] w-full overflow-hidden rounded-lg border border-border/70 bg-graphite sm:w-56">
              {p.next.image ? (
                <img
                  src={p.next.image}
                  alt={p.next.name}
                  loading="lazy"
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                />
              ) : (
                <ProjectThumb name={p.next.name} className="h-full w-full rounded-none border-0" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                {p.next.name}
              </h3>
              {p.next.solutionType && (
                <p className="mt-1 text-xs uppercase tracking-[0.15em] text-primary">
                  {p.next.solutionType}
                </p>
              )}
            </div>
            <ArrowRight className="size-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border/60">
        <CircuitBackground />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-14 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Precisa de uma solução parecida?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Vamos desenvolver algo para sua empresa.
          </p>
          <Link
            to="/contact"
            className="bg-gold-metal mt-7 inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Fale com a EFC <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
