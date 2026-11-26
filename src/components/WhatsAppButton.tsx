import { MessageCircle } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { buildWhatsAppHref, useContactSettings } from "@/lib/media";

const DEFAULT_MESSAGE =
  "Olá! Vim pelo site da EFC Tecnologia e gostaria de conversar sobre um projeto.";

export default function WhatsAppButton() {
  const { data: settings } = useContactSettings();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (!settings?.whatsapp) return null;
  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return null;

  return (
    <a
      href={buildWhatsAppHref(settings.whatsapp, DEFAULT_MESSAGE)}
      target="_blank"
      rel="noreferrer"
      aria-label="Conversar no WhatsApp"
      className="group fixed bottom-5 right-5 z-50 grid size-13 place-items-center rounded-full border border-primary/50 bg-card/90 shadow-lg shadow-black/40 backdrop-blur transition-all hover:scale-105 hover:border-primary hover:bg-primary/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:bottom-6 sm:right-6"
    >
      <MessageCircle className="size-6 text-primary" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-md border border-border bg-card px-3 py-1.5 text-xs text-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100 sm:block">
        Fale comigo no WhatsApp
      </span>
    </a>
  );
}
