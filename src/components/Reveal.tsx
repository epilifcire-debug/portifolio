import type { ElementType } from "react";
import { useReveal } from "@/hooks/use-reveal";

export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Component = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const ref = useReveal<HTMLElement>(0.1);
  const style = delay ? { transitionDelay: `${delay}ms` } : undefined;
  return (
    <Component ref={ref as React.Ref<HTMLElement>} className={`reveal ${className}`} style={style}>
      {children}
    </Component>
  );
}
