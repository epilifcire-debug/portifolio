import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock } from "lucide-react";
import CircuitBackground from "@/components/CircuitBackground";
import { formatArticleDate, parseArticleBlocks, useArticle } from "@/lib/content";

export const Route = createFileRoute("/articles/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: "Artigo | EFC Tecnologia" },
      {
        name: "description",
        content: "Case técnico publicado pela EFC Tecnologia.",
      },
      { property: "og:title", content: "Artigo | EFC Tecnologia" },
      { property: "og:description", content: "Case técnico publicado pela EFC Tecnologia." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `https://efcsys.com/articles/${params.slug}` }],
  }),
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useArticle(slug);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-sm text-muted-foreground sm:px-6">
        Carregando artigo...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-foreground">Artigo não encontrado</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Este conteúdo não existe ou ainda não foi publicado.
        </p>
        <Link
          to="/articles"
          className="mt-6 inline-flex items-center gap-2 rounded-md border border-primary/60 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
        >
          <ArrowLeft className="size-4" /> Ver todos os artigos
        </Link>
      </div>
    );
  }

  const blocks = parseArticleBlocks(data.content);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    description: data.excerpt,
    datePublished: data.published_at,
    dateModified: data.updated_at,
    author: { "@type": "Organization", name: "EFC Tecnologia" },
    publisher: { "@type": "Organization", name: "EFC Tecnologia" },
    mainEntityOfPage: `https://efcsys.com/articles/${data.slug}`,
    ...(data.cover_image ? { image: data.cover_image } : {}),
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative overflow-hidden border-b border-border/60">
        <CircuitBackground />
        <div className="relative mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
          <Link
            to="/articles"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-3.5" /> Artigos
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-primary">
            <span>{formatArticleDate(data.published_at)}</span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Clock className="size-3" /> {data.read_minutes} min de leitura
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-bold leading-[1.15] text-foreground sm:text-4xl">
            {data.title}
          </h1>
          {data.excerpt && (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{data.excerpt}</p>
          )}
        </div>
      </section>

      {data.cover_image && (
        <div className="mx-auto w-full max-w-4xl px-4 pt-10 sm:px-6">
          <img
            src={data.cover_image}
            alt={data.title}
            decoding="async"
            className="w-full rounded-xl border border-border object-cover"
          />
        </div>
      )}

      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        {blocks.map((b, i) =>
          b.type === "heading" ? (
            <h2 key={i} className="mt-10 text-xl font-bold text-foreground first:mt-0">
              {b.text}
            </h2>
          ) : (
            <p key={i} className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {b.text}
            </p>
          ),
        )}

        {data.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-border/60 pt-6">
            {data.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-border bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
