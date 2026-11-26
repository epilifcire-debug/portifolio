import { GripVertical } from "lucide-react";
import { useState } from "react";

export function SortableRow({
  id,
  index,
  children,
  onMove,
}: {
  id: string;
  index: number;
  children: React.ReactNode;
  onMove: (from: number, to: number) => void;
}) {
  const [dragOver, setDragOver] = useState<"above" | "below" | null>(null);

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", String(index));
        e.dataTransfer.effectAllowed = "move";
      }}
      onDragOver={(e) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        setDragOver(e.clientY < midpoint ? "above" : "below");
      }}
      onDragLeave={() => setDragOver(null)}
      onDrop={(e) => {
        e.preventDefault();
        const from = Number(e.dataTransfer.getData("text/plain"));
        const to = dragOver === "above" ? index : index + 1;
        setDragOver(null);
        if (from === to || from + 1 === to) return;
        onMove(from, to > from ? to - 1 : to);
      }}
      className={`flex items-center gap-2 rounded-lg border border-transparent bg-card/60 px-2 py-2 transition-colors ${
        dragOver === "above" ? "border-t-primary" : dragOver === "below" ? "border-b-primary" : ""
      }`}
    >
      <button
        type="button"
        aria-label="Arrastar para reordenar"
        className="grid cursor-grab place-items-center rounded-md p-1 text-muted-foreground hover:text-foreground active:cursor-grabbing"
      >
        <GripVertical className="size-4" />
      </button>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
