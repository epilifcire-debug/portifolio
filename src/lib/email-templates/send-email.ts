import * as React from "react";
import { render } from "@react-email/render";
import { TEMPLATES } from "./registry";

// Server-only: lê RESEND_API_KEY, MAIL_FROM e MAIL_TO do ambiente. Nunca importar em componentes de cliente.

export type SendTemplateEmailResult = { sent: true } | { sent: false; reason: "not_configured" };

export interface SendTemplateEmailOptions {
  templateData?: Record<string, any>;
  /** Chave para evitar envio duplicado em retentativas. */
  idempotencyKey?: string;
  replyTo?: string;
}

/**
 * Renderiza um template registrado e envia pela API do Resend.
 * Se RESEND_API_KEY não existir, retorna { sent: false } sem quebrar o fluxo do formulário.
 */
export async function sendTemplateEmail(
  templateName: string,
  to: string,
  options: SendTemplateEmailOptions = {},
): Promise<SendTemplateEmailResult> {
  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY não configurada; e-mail não enviado");
    return { sent: false, reason: "not_configured" };
  }

  const template = TEMPLATES[templateName];
  if (!template) {
    throw new Error(
      `Template '${templateName}' não encontrado. Disponíveis: ${Object.keys(TEMPLATES).join(", ")}`,
    );
  }

  // O destinatário fixo do template tem prioridade; senão usa MAIL_TO do ambiente.
  const recipient = template.to || to || process.env["MAIL_TO"] || "";
  if (!recipient) {
    throw new Error("Destinatário obrigatório (defina MAIL_TO ou o destinatário do template)");
  }

  const templateData = options.templateData ?? {};
  const element = React.createElement(template.component, templateData);
  const html = await render(element);
  const text = await render(element, { plainText: true });
  const subject =
    typeof template.subject === "function" ? template.subject(templateData) : template.subject;

  const from = process.env["MAIL_FROM"] || "EFC Tecnologia <noreply@efcsys.com>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(options.idempotencyKey ? { "Idempotency-Key": options.idempotencyKey } : {}),
    },
    body: JSON.stringify({
      from,
      to: [recipient],
      subject,
      html,
      text,
      ...(options.replyTo ? { reply_to: options.replyTo } : {}),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend respondeu ${response.status}: ${detail}`);
  }

  return { sent: true };
}
