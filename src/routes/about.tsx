import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  Code2,
  Palette,
  Smartphone,
  Globe,
  Database,
  Plug,
  ArrowRight,
  Zap,
  Target,
  Users,
} from "lucide-react";
import CircuitBackground from "@/components/CircuitBackground";
import DevelopmentProcess from "@/components/DevelopmentProcess";
import { Reveal } from "@/components/Reveal";
import { getAboutData } from "@/lib/about";

const aboutQueryOptions = queryOptions({
  queryKey: ["about"],
  queryFn: () => getAboutData(),
});

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Sobre | EFC Tecnologia" },
      {
        name: "description",
        content:
          "Conheça a EFC Tecnologia: aplicativos, PWAs e sistemas personalizados criados por Eric Filipe para resolver problemas reais.",
      },
      { property: "og:title", content: "Sobre | EFC Tecnologia" },
      {
        property: "og:description",
        content:
          "Tecnologia premium, engenharia digital e sistemas personalizados. Soluções que conectam o seu futuro.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(aboutQueryOptions),
  component: About,
});

const services = [
  {
    icon: Code2,
    title: "Desenvolvimento",
    text: "Aplicações sob medida, do conceito à entrega, com código limpo e arquitetura escalável.",
  },
  {
    icon: Palette,
    title: "UI/UX",
    text: "Interfaces claras, modernas e fáceis de usar, pensadas para converter e encantar.",
  },
  {
    icon: Smartphone,
    title: "PWAs",
    text: "Aplicações instaláveis, rápidas e seguras que funcionam em qualquer dispositivo.",
  },
  {
    icon: Globe,
    title: "Sistemas Web",
    text: "Plataformas completas, responsivas e preparadas para crescer com o seu negócio.",
  },
  {
    icon: Database,
    title: "Banco de Dados",
    text: "Modelagem, gestão e integração de dados eficientes para decisões mais inteligentes.",
  },
  {
    icon: Plug,
    title: "Integrações",
    text: "APIs, serviços e sistemas conectados para automatizar processos e ganhar escala.",
  },
];

const values = [
  {
    icon: Target,
    title: "Propósito",
    text: "Transformar ideias e necessidades reais em soluções digitais funcionais.",
  },
  {
    icon: Zap,
    title: "Execução",
    text: "Entregas contínuas, validação em campo e atenção aos detalhes que fazem a diferença.",
  },
  {
    icon: Users,
    title: "Parceria",
    text: "Trabalho próximo ao cliente, com comunicação clara e foco em resultados.",
  },
];

function About() {
  const { data } = useSuspenseQuery(aboutQueryOptions);

  const defaultStory =
    "A EFC Tecnologia é uma marca individual de Eric Filipe, desenvolvedor focado na criação de aplicativos, PWAs e sistemas personalizados. Cada projeto é tratado como uma engenharia digital: entender o problema, desenhar a solução e entregar algo que realmente funcione.";

  const storyText = data.institutionalText?.trim() || defaultStory;

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <CircuitBackground />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.3em] text-primary">Sobre</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
              Tecnologia premium para <span className="text-gold-metal">resolver problemas reais</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Sou Eric Filipe, desenvolvedor por trás da EFC Tecnologia e da EFCSYS. Transformo ideias e
              necessidades em sistemas digitais funcionais, modernos e adaptados a cada projeto.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/projects"
                className="bg-gold-metal inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:translate-x-0.5"
              >
                Ver projetos <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm text-foreground transition-colors hover:border-primary/60 hover:text-primary"
              >
                Fale comigo
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.3em] text-primary">Quem somos</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">
                Engenharia digital com identidade
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
                {storyText.split("\n").map((paragraph, i) =>
                  paragraph.trim() ? <p key={i}>{paragraph.trim()}</p> : null
                )}
              </div>
            </Reveal>
            {data.signatureUrl && (
              <Reveal delay={240}>
                <div className="mt-8">
                  <img
                    src={data.signatureUrl}
                    alt={data.signatureAlt}
                    className="max-w-[280px]"
                    loading="lazy"
                  />
                </div>
              </Reveal>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal key={v.title} delay={i * 90}>
                  <div className="panel p-5">
                    <Icon className="size-5 text-primary" />
                    <h3 className="mt-4 text-base font-semibold text-foreground">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-y border-border/40 bg-card/30">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.3em] text-primary">O que desenvolvemos</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">
              Soluções para cada etapa do seu negócio
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.title} delay={i * 60}>
                  <div className="panel panel-hover p-6">
                    <Icon className="size-5 text-primary" />
                    <h3 className="mt-4 text-base font-semibold text-foreground">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.3em] text-primary">Indicadores</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">
            Resultados que constroem confiança
          </h2>
        </Reveal>
        {data.metrics.length > 0 ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.metrics.map((m, i) => (
              <Reveal key={`${m.label}-${i}`} delay={i * 70}>
                <div className="panel p-6 text-center">
                  <p className="text-3xl font-bold text-gold-metal">{m.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{m.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal delay={160}>
            <p className="mt-10 text-sm text-muted-foreground">
              Métricas institucionais serão exibidas aqui assim que configuradas no painel administrativo.
            </p>
          </Reveal>
        )}
      </section>

      {/* Process */}
      <DevelopmentProcess />

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border/60">
        <CircuitBackground />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 text-center sm:px-6 lg:py-24">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.3em] text-primary">Próximo passo</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">
              Vamos construir a sua solução?
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Conte sua ideia. Eu cuido da arquitetura, do design e do desenvolvimento para entregar um
              produto funcional e alinhado ao seu objetivo.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/contact"
                className="bg-gold-metal inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:translate-x-0.5"
              >
                Iniciar um projeto <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm text-foreground transition-colors hover:border-primary/60 hover:text-primary"
              >
                Ver portfólio
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
