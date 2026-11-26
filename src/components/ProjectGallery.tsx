import { useState } from "react";
import { ProjectThumb } from "./ProjectCard";
import Lightbox from "./Lightbox";
import type { DetailImage } from "@/lib/project-detail";

function Shot({
  item,
  name,
  onOpen,
  className = "",
}: {
  item: DetailImage;
  name: string;
  onOpen: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`panel-hover group block w-full overflow-hidden rounded-xl border border-border/70 bg-graphite text-left transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${className}`}
      aria-label={`Ampliar imagem: ${item.caption}`}
    >
      {item.src ? (
        <img
          src={item.src}
          alt={item.alt || `${name} — ${item.caption}`}
          loading="lazy"
          decoding="async"
          className="h-full w-full transition-transform duration-300 group-hover:scale-[1.02]"
          style={{
            objectFit: (item.fit as "contain" | "cover") || "contain",
            objectPosition: item.position || "center",
          }}
        />
      ) : (
        <ProjectThumb name={`${name} ${item.caption}`} className="h-full w-full rounded-none border-0" />
      )}
    </button>
  );
}

export function ProjectGallery({ items, name }: { items: DetailImage[]; name: string }) {
  const [open, setOpen] = useState<number | null>(null);
  if (items.length === 0) return null;

  // Alternating compositions: each block shows one large image + up to two supporting shots.
  const blocks: { lead: number; support: number[] }[] = [];
  for (let i = 0; i < items.length; i += 3) {
    blocks.push({
      lead: i,
      support: [i + 1, i + 2].filter((n) => n < items.length),
    });
  }

  return (
    <>
      <div className="space-y-6">
        {blocks.map((block, bi) => {
          const reversed = bi % 2 === 1;
          const lead = items[block.lead]!;
          return (
            <div
              key={block.lead}
              className={`grid gap-4 lg:grid-cols-[1.6fr_1fr] ${reversed ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              <Shot
                item={lead}
                name={name}
                onOpen={() => setOpen(block.lead)}
                className="aspect-[16/10]"
              />
              {block.support.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {block.support.map((si) => (
                    <Shot
                      key={si}
                      item={items[si]!}
                      name={name}
                      onOpen={() => setOpen(si)}
                      className="aspect-[4/3] lg:aspect-[16/11]"
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {open !== null && (
        <Lightbox
          items={items}
          index={open}
          name={name}
          onClose={() => setOpen(null)}
          onChange={setOpen}
        />
      )}
    </>
  );
}

export default ProjectGallery;
