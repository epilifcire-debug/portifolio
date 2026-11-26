import { createFileRoute } from "@tanstack/react-router";
import { Cpu } from "lucide-react";
import CircuitBackground from "@/components/CircuitBackground";
import { techGroups } from "@/data/technologies";

export const Route = createFileRoute("/technologies")({
  head: () => ({
    meta: [
      { title: "Tecnologias | EFC Tecnologia" },
      {
        name: "description",
        content:
          "Tecnologias e ferramentas utilizadas nos projetos da EFC Tecnologia: front-end, back-end, banco de dados, integrações e ferramentas.",
      },
      { property: "og:title", content: "Tecnologias | EFC Tecnologia" },
      {
        property: "og:description",
        content: "Stack de desenvolvimento utilizada nos projetos da EFC Tecnologia.",
      },
    ],
  }),
  component: Technologies,
});

function Technologies() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border/60">
        <CircuitBackground />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Tecnologias &amp; Ferramentas
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            As principais tecnologias utilizadas no desenvolvimento dos projetos.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl space-y-10 px-4 py-12 sm:px-6">
        {techGroups.map((group) => (
          <div key={group.title}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              {group.title}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((t) => (
                <div key={t.name} className="panel panel-hover flex items-start gap-3 p-5">
                  <Cpu className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{t.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {t.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
