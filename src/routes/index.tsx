import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  ChartColumn,
  Circle,
  LayoutDashboard,
  Smartphone,
  Workflow,
} from "lucide-react";
import CircuitBackground from "@/components/CircuitBackground";
import { ProjectCard } from "@/components/ProjectCard";
import HeroShowcase from "@/components/HeroShowcase";
import DevelopmentProcess from "@/components/DevelopmentProcess";
import Marquee from "@/components/Marquee";
import Testimonials from "@/components/Testimonials";
import { projects } from "@/data/projects";
import { mainTech } from "@/data/technologies";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EFC Tecnologia | Sistemas, Aplicativos e Automações" },
      {
        name: "description",
        content:
          "Desenvolvemos aplicativos, plataformas de gestão, dashboards, automações e soluções digitais personalizadas para empresas, profissionais e eventos.",
      },
      { property: "og:title", content: "EFC Tecnologia | Sistemas que resolvem problemas reais" },
      {
        property: "og:description",
        content:
          "Aplicativos, plataformas de gestão, dashboards, automações e soluções digitais personalizadas.",
      },
    ],
  }),
  component: Index,
});

const SOLUTIONS = [
  { icon: LayoutDashboard, title: "Sistemas de Gestão", text: "Plataformas sob medida para operação, clientes e rotinas." },
  { icon: Smartphone, title: "Aplicativos e PWAs", text: "Apps instaláveis no celular, responsivos e rápidos." },
  { icon: ChartColumn, title: "Dashboards e Dados", text: "Indicadores e relatórios para decidir com segurança." },
  { icon: Bot, title: "Automações e Bots", text: "Bots de WhatsApp que eliminam tarefas manuais." },
  { icon: CalendarCheck, title: "Soluções para Eventos", text: "Cortesias, credenciamento, agendas e gestão de público." },
  { icon: Workflow, title: "Integrações", text: "APIs, calendários, pagamentos e sistemas conectados." },
];

function Index() {
  const featured = projects.slice(0, 3);
  const solutionsRef = useReveal<HTMLDivElement>(0.1);
  const techRef = useReveal<HTMLDivElement>(0.1);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <CircuitBackground />
        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-pill border border-border px-3 py-1.5 text-sm text-muted-foreground">
              <Circle className="size-2 fill-primary text-primary" aria-hidden />
              Disponível para novos projetos
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-[1.08] text-foreground sm:text-5xl lg:text-[3.6rem]">
              Transformamos ideias em sistemas que resolvem{" "}
              <span className="text-gold-metal">problemas reais</span>.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Aplicativos, plataformas de gestão, dashboards, automações e soluções digitais
              personalizadas para empresas, profissionais e eventos.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/projects"
                className="bg-gold-metal inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 [&:hover_svg]:translate-x-0.5"
              >
                Ver projetos <ArrowRight className="size-4 transition-transform duration-200" />
              </Link>
              <a
                href="#solucoes"
                className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary/60 hover:text-primary"
              >
                Conheça as soluções
              </a>
            </div>
          </div>

          <HeroShowcase projects={featured} />
        </div>
      </section>

      {/* PROJETOS EM DESTAQUE */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6" aria-labelledby="destaques">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">Projetos em destaque</p>
            <h2 id="destaques" className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              Soluções que geram resultados
            </h2>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-[gap] duration-200 hover:gap-2.5"
          >
            Ver todos os projetos <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      {/* SOLUÇÕES */}
      <section
        id="solucoes"
        className="border-y border-border/60"
        aria-labelledby="solucoes-title"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <p className="text-sm font-medium text-primary">O que desenvolvemos</p>
          <h2 id="solucoes-title" className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
            Soluções completas para diferentes segmentos
          </h2>
          <div
            ref={solutionsRef}
            className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
          >
            {SOLUTIONS.map((s, i) => (
              <article
                key={s.title}
                className="reveal border-t border-border pt-6"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <s.icon className="size-5 text-primary" aria-hidden />
                <h3 className="mt-4 text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESSO */}
      <DevelopmentProcess />

      {/* TECNOLOGIAS */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6" aria-labelledby="tech">
        <div ref={techRef} className="reveal flex flex-wrap items-center justify-between gap-6 border-t border-border pt-10">
          <div>
            <p className="text-sm font-medium text-primary">Stack</p>
            <h2 id="tech" className="mt-2 text-xl font-bold text-foreground sm:text-2xl">
              Tecnologias que utilizamos
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {mainTech.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:border-primary/50 hover:text-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <Link
            to="/technologies"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-[gap] duration-200 hover:gap-2.5"
          >
            Ver todas <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <div className="panel flex flex-wrap items-center justify-between gap-6 p-8 sm:p-12">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Tem uma ideia? Vamos transformar em um{" "}
              <span className="text-gold-metal">sistema</span>.
            </h2>
          </div>
          <Link
            to="/contact"
            className="bg-gold-metal inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 [&:hover_svg]:translate-x-0.5"
          >
            Fale com a EFC <ArrowRight className="size-4 transition-transform duration-200" />
          </Link>
        </div>
      </section>

      <Testimonials />

      <Marquee />
    </div>
  );
}
