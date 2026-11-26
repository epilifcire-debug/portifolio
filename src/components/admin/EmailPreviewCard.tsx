import { useState } from "react";
import { Mail } from "lucide-react";
import { ContactNotification, template } from "@/lib/email-templates/contact-notification";

const preview = template.previewData;

export function EmailPreviewCard() {
  const [data, setData] = useState({
    name: preview.name,
    email: preview.email,
    phone: preview.phone,
    projectType: preview.projectType,
    message: preview.message,
  });

  const subject = template.subject({ name: data.name });

  const inputClass =
    "mt-1.5 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60";
  const labelClass = "block text-xs text-muted-foreground";

  return (
    <section className="panel p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
        <Mail className="size-4 text-primary" /> Pré-visualização do e-mail
      </h2>
      <p className="text-xs text-muted-foreground">
        Modelo enviado quando alguém preenche o formulário de contato.
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <label className={labelClass}>
            Nome
            <input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} className={inputClass} />
          </label>
          <label className={labelClass}>
            E-mail
            <input value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} className={inputClass} />
          </label>
          <label className={labelClass}>
            Telefone
            <input value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} className={inputClass} />
          </label>
          <label className={labelClass}>
            Tipo de projeto
            <input
              value={data.projectType}
              onChange={(e) => setData({ ...data, projectType: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Mensagem
            <textarea
              value={data.message}
              onChange={(e) => setData({ ...data, message: e.target.value })}
              rows={4}
              className={inputClass}
            />
          </label>
        </div>

        <div className="rounded-xl border border-border bg-background/60 p-4">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground/70">Destinatário</p>
          <p className="text-sm text-foreground">{template.to}</p>
          <p className="mt-3 text-[11px] uppercase tracking-wide text-muted-foreground/70">Assunto</p>
          <p className="text-sm text-foreground">{subject}</p>
          <div className="mt-4 overflow-hidden rounded-lg border border-border">
            <ContactNotification {...data} />
          </div>
        </div>
      </div>
    </section>
  );
}
