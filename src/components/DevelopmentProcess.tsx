import { Reveal } from "@/components/Reveal";

const STEPS = [
  { n: "01", title: "Entendimento", text: "Escuto o problema, o contexto e a operação real." },
  { n: "02", title: "Planejamento", text: "Escopo, prioridades e estrutura da solução." },
  { n: "03", title: "Design", text: "Interfaces claras, objetivas e responsivas." },
  { n: "04", title: "Desenvolvimento", text: "Construção do sistema com entregas contínuas." },
  { n: "05", title: "Testes", text: "Validação de fluxos, dados e uso em campo." },
  { n: "06", title: "Entrega", text: "Publicação, acompanhamento e evolução." },
];

export function DevelopmentProcess() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="processo">
      <p className="text-[11px] uppercase tracking-[0.3em] text-primary">Da ideia ao sistema</p>
      <h2 id="processo" className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">
        Nosso processo de desenvolvimento
      </h2>

      <div className="relative mt-10">
        <span
          aria-hidden
          className="absolute left-[22px] top-2 hidden h-[calc(100%-1rem)] w-px bg-border md:block lg:left-0 lg:top-[22px] lg:h-px lg:w-full"
        />
        <ol className="grid gap-6 md:gap-8 lg:grid-cols-6">
          {STEPS.map((step, i) => (
            <Reveal
              key={step.n}
              as="li"
              delay={i * 90}
              className="relative flex gap-4 lg:block"
            >
              <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full border border-border bg-background font-display text-xs text-primary">
                {step.n}
              </span>
              <div className="lg:mt-4">
                <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default DevelopmentProcess;
