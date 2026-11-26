const DEFAULT_ITEMS = [
  "EFC TECNOLOGIA",
  "SISTEMAS",
  "APLICATIVOS",
  "AUTOMAÇÕES",
  "EVENTOS",
  "DADOS",
  "RESULTADOS",
];

export function Marquee({ items = DEFAULT_ITEMS }: { items?: string[] }) {
  const sequence = [...items, ...items];

  return (
    <div
      aria-hidden
      className="relative overflow-hidden border-y border-border/60 bg-card/30 py-4"
    >
      <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
        {sequence.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-8">
            <span className="font-display text-xs uppercase tracking-[0.35em] text-muted-foreground">
              {item}
            </span>
            <span className="size-1 rounded-full bg-primary/70" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default Marquee;
