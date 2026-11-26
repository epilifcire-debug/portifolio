import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ProjectThumb } from "@/components/ProjectCard";
import type { Project } from "@/data/projects";
import { useAllMedia } from "@/lib/media";

const INTERVAL = 5200;

export function HeroShowcase({ projects }: { projects: Project[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const media = useAllMedia().data ?? [];

  useEffect(() => {
    if (paused || projects.length < 2) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % projects.length), INTERVAL);
    return () => clearInterval(id);
  }, [paused, projects.length]);

  useEffect(() => () => { if (resumeRef.current) clearTimeout(resumeRef.current); }, []);

  const select = (i: number) => {
    setIndex(i);
    setPaused(true);
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => setPaused(false), 12000);
  };

  if (projects.length === 0) return null;

  return (
    <div
      className="panel relative overflow-hidden p-4 sm:p-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[16/11] w-full">
        {projects.map((project, i) => {
          const shot = media.find((m) => m.project_slug === project.slug)?.src;
          const active = i === index;
          return (
            <Link
              key={project.slug}
              to="/projects/$slug"
              params={{ slug: project.slug }}
              aria-hidden={!active}
              tabIndex={active ? 0 : -1}
              className="absolute inset-0 block rounded-xl transition-[opacity,transform] duration-500 ease-[var(--ease-emphasis)]"
              style={{
                opacity: active ? 1 : 0,
                transform: active ? "none" : "translateX(14px) scale(0.985)",
                pointerEvents: active ? "auto" : "none",
              }}
            >
              {shot ? (
                <img
                  src={shot}
                  alt={`Tela do sistema ${project.name}`}
                  loading="lazy"
                  className="h-full w-full rounded-xl border border-border/70 object-cover"
                />
              ) : (
                <ProjectThumb name={project.name} className="h-full w-full" />
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-5 flex items-end justify-between gap-4">
        <div aria-live="polite">
          <p className="font-display text-lg text-foreground">{projects[index]?.name}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-primary">
            {projects[index]?.tags.join(" • ")}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {projects.map((project, i) => (
            <button
              key={project.slug}
              type="button"
              onClick={() => select(i)}
              aria-label={`Mostrar ${project.name}`}
              aria-current={i === index}
              className="grid size-11 place-items-center"
            >
              <span
                className="block h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === index ? 22 : 8,
                  background: i === index ? "var(--gold)" : "var(--border-neutral)",
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeroShowcase;
