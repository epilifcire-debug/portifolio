import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Mail, Linkedin, Github, Send, Loader2, CalendarClock } from "lucide-react";
import CircuitBackground from "@/components/CircuitBackground";
import { contact, projectTypes } from "@/data/site";
import { useContactSettings, buildWhatsAppHref } from "@/lib/media";
import { contactFormSchema } from "@/lib/contact-messages";
import { submitContact } from "@/lib/contact.functions";


export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contato | EFC Tecnologia" },
      {
        name: "description",
        content:
          "Tem uma ideia para um aplicativo, sistema ou ferramenta digital? Entre em contato com a EFC Tecnologia.",
      },
      { property: "og:title", content: "Contato | EFC Tecnologia" },
      {
        property: "og:description",
        content: "Vamos conversar sobre seu projeto.",
      },
    ],
  }),
  component: Contact,
});

const cards = [
  { icon: MessageCircle, key: "whatsapp" as const, ...contact.whatsapp },
  { icon: Mail, key: "email" as const, ...contact.email },
  { icon: Linkedin, key: "linkedin" as const, ...contact.linkedin },
  { icon: Github, key: "github" as const, ...contact.github },
];

function Contact() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const settings = useContactSettings().data;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parsed = contactFormSchema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone") || undefined,
      project_type: fd.get("type") || undefined,
      message: fd.get("message"),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Verifique os campos do formulário.");
      return;
    }
    setSending(true);
    setError(null);
    try {
      await submitContact({ data: parsed.data });
      form.reset();
      setSent(true);
    } catch {
      setError("Não foi possível enviar sua mensagem. Tente novamente ou use um dos canais ao lado.");
    }
    setSending(false);
  }

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border/60">
        <CircuitBackground />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Vamos conversar sobre seu projeto?
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Tem uma ideia para um aplicativo, sistema ou ferramenta digital? Entre em contato.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3">
          {cards.map((card) => {
            const rawHref = settings?.[card.key] || card.href;
            const c = {
              ...card,
              href:
                card.key === "whatsapp" && rawHref
                  ? buildWhatsAppHref(rawHref, "Olá! Vim pelo site da EFC Tecnologia e gostaria de conversar sobre um projeto.")
                  : rawHref,
            };
            const Inner = (
              <>
                <c.icon className="mt-0.5 size-4 shrink-0 text-primary" />
                <div>
                  <h2 className="text-sm font-semibold text-foreground">{c.label}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>
                </div>
              </>
            );
            return c.href ? (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                className="panel panel-hover flex items-start gap-3 p-5"
              >
                {Inner}
              </a>
            ) : (
              <div key={c.label} className="panel flex items-start gap-3 p-5 opacity-70">
                {Inner}
              </div>
            );
          })}
          {settings?.calendly && (
            <a
              href={settings.calendly}
              target="_blank"
              rel="noreferrer"
              className="panel panel-hover flex items-start gap-3 border-primary/40 p-5"
            >
              <CalendarClock className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <h2 className="text-sm font-semibold text-foreground">Agendar uma conversa</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Escolha o melhor dia e horário direto na minha agenda
                </p>
              </div>
            </a>
          )}
        </div>

        <form className="panel space-y-4 p-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs text-muted-foreground">
              Nome
              <input
                required
                name="name"
                placeholder="Seu nome"
                maxLength={100}
                className="mt-1.5 w-full rounded-md border border-input bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/60"
              />
            </label>
            <label className="block text-xs text-muted-foreground">
              E-mail
              <input
                required
                type="email"
                name="email"
                placeholder="voce@email.com"
                maxLength={255}
                className="mt-1.5 w-full rounded-md border border-input bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/60"
              />
            </label>
          </div>
          <label className="block text-xs text-muted-foreground">
            WhatsApp / Telefone
            <input
              name="phone"
              placeholder="(00) 00000-0000"
              maxLength={30}
              className="mt-1.5 w-full rounded-md border border-input bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/60"
            />
          </label>
          <label className="block text-xs text-muted-foreground">
            Tipo de projeto
            <select
              name="type"
              defaultValue=""
              className="mt-1.5 w-full rounded-md border border-input bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/60"
            >
              <option value="" disabled>
                Selecione o tipo de projeto
              </option>
              {projectTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs text-muted-foreground">
            Mensagem
            <textarea
              required
              name="message"
              rows={5}
              placeholder="Descreva sua ideia ou projeto"
              maxLength={2000}
              className="mt-1.5 w-full rounded-md border border-input bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/60"
            />
          </label>
          <button
            type="submit"
            disabled={sending}
            className="bg-gold-metal inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            {sending ? "Enviando..." : "Enviar mensagem"}
          </button>
          {error && <p className="text-xs text-destructive">{error}</p>}
          {sent && !error && (
            <p className="text-xs text-primary">
              Mensagem enviada com sucesso! Retornarei o contato em breve.
            </p>
          )}
        </form>
      </section>
    </div>
  );
}
