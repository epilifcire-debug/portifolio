import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/data/projects";

export function ProjectThumb({ name, className = "" }: { name: string; className?: string }) {
  const stop = ["de", "da", "do", "para", "e", "em", "a", "o"];
  const initials = name
    .replace(/[^A-Za-zÀ-ÿ ]/g, " ")
    .split(" ")
    .filter((w) => w && !stop.includes(w.toLowerCase()))
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div
      className={`relative grid place-items-center overflow-hidden rounded-lg border border-border/70 bg-graphite ${className}`}
    >
      <svg aria-hidden viewBox="0 0 200 120" className="absolute inset-0 h-full w-full opacity-40">
        <path
          d="M0 30 H50 L70 50 H130 L150 30 H200 M0 90 H40 L60 70 H120 L140 90 H200"
          fill="none"
          stroke="var(--gold-deep)"
          strokeWidth="1"
        />
        <circle cx="70" cy="50" r="2.5" fill="none" stroke="var(--gold)" strokeWidth="1" />
        <circle cx="140" cy="90" r="2.5" fill="none" stroke="var(--silver)" strokeWidth="1" />
      </svg>
      <span className="font-display relative text-2xl tracking-[0.2em] text-gold-metal">
        {initials}
      </span>
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="panel panel-hover flex flex-col overflow-hidden">
      <ProjectThumb name={project.name} className="m-3 mb-0 aspect-[16/10]" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="text-base font-semibold text-foreground">{project.name}</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.15em] text-primary">
            {project.tags.join(" / ")}
          </p>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{project.short}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {project.technologies.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded border border-border bg-secondary/60 px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
        <Link
          to="/projects/$slug"
          params={{ slug: project.slug }}
          className="inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-primary"
        >
          Ver projeto <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}

export default ProjectCard;
