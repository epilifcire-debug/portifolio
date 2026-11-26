import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ProjectThumb } from "@/components/ProjectCard";
import type { CatalogProject } from "@/lib/catalog";

export function ProjectCatalogCard({ project }: { project: CatalogProject }) {
  return (
    <Link
      to="/projects/$slug"
      params={{ slug: project.slug }}
      className="group panel flex flex-col overflow-hidden transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/60 focus-visible:-translate-y-1 focus-visible:border-primary/60 focus-visible:outline-none"
      aria-label={`${project.name} — ${project.solutionType}`}
    >
      <div className="relative m-3 mb-0 aspect-[16/10] overflow-hidden rounded-lg border border-border/70 bg-graphite">
        {project.image ? (
          <img
            src={project.image}
            alt={project.alt || `${project.name} — ${project.solutionType}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]"
            style={{
              objectFit: (project.fit as "contain" | "cover") || "contain",
              objectPosition: project.position || "center",
            }}
          />
        ) : (
          <ProjectThumb name={project.name} className="h-full w-full rounded-none border-0" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-primary">
          {project.name}
        </h3>
        {project.solutionType && (
          <p className="text-xs uppercase tracking-[0.15em] text-primary">{project.solutionType}</p>
        )}
        {project.short && (
          <p className="text-sm leading-relaxed text-muted-foreground">{project.short}</p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-3">
          {project.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded border border-border bg-secondary/60 px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {t}
            </span>
          ))}
          <ArrowRight className="ml-auto size-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

export default ProjectCatalogCard;
