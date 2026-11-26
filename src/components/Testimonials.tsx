import { Quote, Star } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { useTestimonials } from "@/lib/content";

export default function Testimonials() {
  const { data } = useTestimonials();
  const items = data ?? [];

  if (items.length === 0) return null;

  return (
    <section
      className="border-y border-border/60 bg-card/20"
      aria-labelledby="depoimentos-title"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-[11px] uppercase tracking-[0.3em] text-primary">Depoimentos</p>
        <h2 id="depoimentos-title" className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">
          O que dizem sobre o nosso trabalho
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <Reveal as="article" key={t.id} className="panel panel-hover p-6" delay={i * 80}>
              <Quote className="size-6 text-primary" aria-hidden />
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">“{t.quote}”</p>

              {t.rating > 0 && (
                <div className="mt-4 flex gap-0.5" aria-label={`Nota ${t.rating} de 5`}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className={`size-3.5 ${s < t.rating ? "fill-primary text-primary" : "text-border"}`}
                      aria-hidden
                    />
                  ))}
                </div>
              )}

              <div className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                {t.avatar_url ? (
                  <img
                    src={t.avatar_url}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-10 rounded-full border border-border object-cover"
                  />
                ) : (
                  <span className="grid size-10 place-items-center rounded-full border border-border bg-secondary/60 text-sm font-semibold text-primary">
                    {t.author_name.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{t.author_name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {[t.author_role, t.company].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
