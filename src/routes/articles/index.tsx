import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";
import CircuitBackground from "@/components/CircuitBackground";
import { Reveal } from "@/components/Reveal";
import { formatArticleDate, useArticles } from "@/lib/content";

export const Route = createFileRoute("/articles/")({
  head: () => ({
    meta: [
      { title: "Artigos e Cases Técnicos | EFC Tecnologia" },
      {
        name: "description",
        content:
          "Cases técnicos, bastidores de projetos e conteúdos sobre desenvolvimento de sistemas, aplicativos e automações.",
      },
      { property: "og:title", content: "Artigos e Cases Técnicos | EFC Tecnologia" },
      {
        property: "og:description",
        content: "Cases técnicos e conteúdos sobre sistemas, aplicativos e automações.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ArticlesPage,
});

function ArticlesPage() {
  const { data, isLoading } = useArticles();
  const articles = data ?? [];

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border/60">
        <CircuitBackground />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <p className="font-display text-[11px] uppercase tracking-[0.35em] text-primary">
            Conteúdo
          </p>
          <h1 className="mt-5 max-w-2xl text-3xl font-bold leading-[1.15] text-foreground sm:text-4xl">
            Artigos e <span className="text-gold-metal">cases técnicos</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Bastidores dos projetos, decisões de arquitetura e aprendizados de quem coloca sistemas
            em produção todos os dias.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        {isLoading && <p className="text-sm text-muted-foreground">Carregando artigos...</p>}

        {!isLoading && articles.length === 0 && (
          <div className="panel p-8 text-center">
            <h2 className="text-lg font-semibold text-foreground">Em breve</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Os primeiros artigos e cases técnicos serão publicados aqui.
            </p>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, i) => (
            <Reveal as="article" key={a.id} className="panel panel-hover overflow-hidden" delay={i * 70}>
              <Link to="/articles/$slug" params={{ slug: a.slug }} className="block">
                {a.cover_image && (
                  <img
                    src={a.cover_image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="aspect-[16/9] w-full object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-primary">
                    <span>{formatArticleDate(a.published_at)}</span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Clock className="size-3" /> {a.read_minutes} min
                    </span>
                  </div>
                  <h2 className="mt-3 text-base font-semibold text-foreground">{a.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {a.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Ler artigo <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
