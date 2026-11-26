import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, MailOpen, Trash2, Inbox } from "lucide-react";
import { toast } from "sonner";
import {
  deleteContactMessage,
  fetchContactMessages,
  markMessageRead,
  type ContactMessage,
} from "@/lib/contact-messages";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export function MessagesTab() {
  const queryClient = useQueryClient();
  const messagesQuery = useQuery({ queryKey: ["admin", "messages"], queryFn: fetchContactMessages });
  const [busyId, setBusyId] = useState<string | null>(null);

  const messages = messagesQuery.data ?? [];

  async function toggleRead(m: ContactMessage) {
    setBusyId(m.id);
    try {
      await markMessageRead(m.id, !m.is_read);
      queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
    } catch {
      toast.error("Não foi possível atualizar a mensagem.");
    }
    setBusyId(null);
  }

  async function remove(m: ContactMessage) {
    if (!window.confirm(`Excluir a mensagem de ${m.name}?`)) return;
    setBusyId(m.id);
    try {
      await deleteContactMessage(m.id);
      toast.success("Mensagem excluída.");
      queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
    } catch {
      toast.error("Não foi possível excluir a mensagem.");
    }
    setBusyId(null);
  }

  if (messagesQuery.isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando mensagens...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Mensagens de contato</h2>
        <span className="text-xs text-muted-foreground">
          {messages.filter((m) => !m.is_read).length} não lida(s)
        </span>
      </div>

      {messages.length === 0 && (
        <div className="panel flex flex-col items-center gap-2 p-10 text-center">
          <Inbox className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Nenhuma mensagem recebida ainda.</p>
        </div>
      )}

      <div className="space-y-3">
        {messages.map((m) => (
          <article
            key={m.id}
            className={`panel p-5 ${m.is_read ? "opacity-75" : "border-primary/40"}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{m.name}</h3>
                  {!m.is_read && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                      Nova
                    </span>
                  )}
                  {m.project_type && (
                    <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                      {m.project_type}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  <a href={`mailto:${m.email}`} className="text-primary hover:underline">
                    {m.email}
                  </a>
                  {m.phone ? ` · ${m.phone}` : ""} · {formatDate(m.created_at)}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  disabled={busyId === m.id}
                  onClick={() => toggleRead(m)}
                  title={m.is_read ? "Marcar como não lida" : "Marcar como lida"}
                  className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  {m.is_read ? <Mail className="size-4" /> : <MailOpen className="size-4" />}
                </button>
                <button
                  type="button"
                  disabled={busyId === m.id}
                  onClick={() => remove(m)}
                  title="Excluir mensagem"
                  className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:border-destructive/60 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {m.message}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
