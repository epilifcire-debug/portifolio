import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import CircuitBackground from "@/components/CircuitBackground";
import { showcaseApps, showcaseAutomations, type ShowcaseItem } from "@/data/showcase";

export const Route = createFileRoute("/vitrine")({
  head: () => ({
    meta: [
      { title: "Vitrine | EFC Tecnologia" },
      {
        name: "description",
        content: "Apps e automações desenvolvidos pela EFC Tecnologia para eventos, condomínios, obras e atendimento.",
      },
      { property: "og:title", content: "Vitrine | EFC Tecnologia" },
    ],
  }),
  component: Vitrine,
});

function ShowcaseCard({ item, automation }: { item: ShowcaseItem; automation?: boolean }) {
  return (
    <article className="panel panel-hover flex flex-col overflow-hidden">
      {item.image && (
        <img
          src={item.image}
          alt={`Tela do ${item.name}`}
          loading="lazy"
          className="aspect-video w-full border-b border-border/60 object-cover"
        />
      )}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span
          className={`self-start rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            automation ? "bg-muted text-muted-foreground" : "bg-primary/15 text-primary"
          }`}
        >
          {automation ? "Automação" : item.status}
        </span>
        <h3 className="text-base font-semibold text-foreground">{item.name}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-primary hover:underline"
          >
            {item.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            <ArrowUpRight className="size-4" />
          </a>
        )}
      </div>
    </article>
  );
}

function Vitrine() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border/60">
        <CircuitBackground />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Apps e automações</h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Sistemas em produção, em migração e automações que rodam em segundo plano para eventos,
            condomínios, gestão de obras e atendimento.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl space-y-12 px-4 py-12 sm:px-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Apps</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sistemas web e PWAs com acesso por login.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {showcaseApps.map((item) => (
              <ShowcaseCard key={item.name} item={item} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-foreground">Automações</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Robôs que coletam, conferem e enviam dados sem intervenção manual.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {showcaseAutomations.map((item) => (
              <ShowcaseCard key={item.name} item={item} automation />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
