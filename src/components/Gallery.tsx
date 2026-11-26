import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ProjectThumb } from "./ProjectCard";

export type GalleryItem = { caption: string; src?: string };

export function Gallery({ items, name }: { items: GalleryItem[]; name: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [zoom, setZoom] = useState(false);

  const go = (dir: number) =>
    setOpen((i) => (i === null ? null : (i + dir + items.length) % items.length));

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item, i) => (
          <button
            key={item.caption}
            type="button"
            onClick={() => {
              setOpen(i);
              setZoom(false);
            }}
            className="panel-hover group text-left"
          >
            {item.src ? (
              <img
                src={item.src}
                alt={`${name} — ${item.caption}`}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-xl border border-border/70 object-cover"
              />
            ) : (
              <ProjectThumb name={`${name} ${item.caption}`} className="aspect-[4/3]" />
            )}
            <span className="mt-2 block text-xs text-muted-foreground">{item.caption}</span>
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-100 grid place-items-center bg-background/95 p-4 backdrop-blur"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => setOpen(null)}
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-md border border-border text-foreground"
          >
            <X className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => go(-1)}
            className="absolute left-4 grid size-10 place-items-center rounded-md border border-border text-foreground"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Próxima"
            onClick={() => go(1)}
            className="absolute right-4 top-1/2 grid size-10 place-items-center rounded-md border border-border text-foreground"
          >
            <ChevronRight className="size-4" />
          </button>

          <div className="w-full max-w-3xl">
            <div
              onClick={() => setZoom((z) => !z)}
              className="cursor-zoom-in overflow-hidden rounded-xl"
            >
              {items[open]?.src ? (
                <img
                  src={items[open]?.src}
                  alt={`${name} — ${items[open]?.caption ?? ""}`}
                  className={`aspect-[16/10] w-full rounded-xl object-contain transition-transform duration-300 ${zoom ? "scale-125" : ""}`}
                />
              ) : (
                <ProjectThumb
                  name={`${name} ${items[open]?.caption ?? ""}`}
                  className={`aspect-[16/10] transition-transform duration-300 ${zoom ? "scale-125" : ""}`}
                />
              )}
            </div>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              {items[open]?.caption} — {open + 1}/{items.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Gallery;
