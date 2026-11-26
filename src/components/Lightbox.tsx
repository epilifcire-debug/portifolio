import { useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ProjectThumb } from "./ProjectCard";
import type { DetailImage } from "@/lib/project-detail";

type Props = {
  items: DetailImage[];
  index: number;
  name: string;
  onClose: () => void;
  onChange: (index: number) => void;
};

export function Lightbox({ items, index, name, onClose, onChange }: Props) {
  const startX = useRef<number | null>(null);
  const item = items[index];

  const go = (dir: number) => onChange((index + dir + items.length) % items.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-100 grid place-items-center bg-background/95 p-4 backdrop-blur"
      role="dialog"
      aria-modal="true"
      aria-label={`${name} — visualização de imagem`}
      onTouchStart={(e) => {
        startX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const s = startX.current;
        const end = e.changedTouches[0]?.clientX ?? null;
        if (s !== null && end !== null && Math.abs(end - s) > 48) go(end < s ? 1 : -1);
        startX.current = null;
      }}
    >
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute right-4 top-4 grid size-11 place-items-center rounded-md border border-border text-foreground transition-colors hover:border-primary/60 hover:text-primary"
      >
        <X className="size-4" />
      </button>

      {items.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Imagem anterior"
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-md border border-border text-foreground transition-colors hover:border-primary/60 hover:text-primary sm:grid"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Próxima imagem"
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-md border border-border text-foreground transition-colors hover:border-primary/60 hover:text-primary sm:grid"
          >
            <ChevronRight className="size-4" />
          </button>
        </>
      )}

      <div className="w-full max-w-4xl">
        {item.src ? (
          <img
            src={item.src}
            alt={item.alt || `${name} — ${item.caption}`}
            className="max-h-[70vh] w-full rounded-xl border border-border/60 object-contain"
            style={{ objectPosition: item.position || "center" }}
          />
        ) : (
          <ProjectThumb name={`${name} ${item.caption}`} className="aspect-[16/10] w-full" />
        )}
        <p className="mt-3 text-center text-sm text-muted-foreground">
          {item.caption} — {index + 1}/{items.length}
        </p>
        {items.length > 1 && (
          <p className="mt-1 text-center text-[11px] text-muted-foreground sm:hidden">
            Deslize para navegar
          </p>
        )}
      </div>
    </div>
  );
}

export default Lightbox;
