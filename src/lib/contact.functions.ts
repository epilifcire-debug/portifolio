import { createServerFn } from "@tanstack/react-start";
import { contactFormSchema, type ContactFormInput } from "./contact-messages";

export const submitContact = createServerFn({ method: "POST" })
  .validator((data: ContactFormInput) => contactFormSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: inserted, error } = await supabaseAdmin
      .from("contact_messages")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        project_type: data.project_type || null,
        message: data.message,
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    try {
      const { sendTemplateEmail } = await import("./email-templates/send-email");
      await sendTemplateEmail("contact-notification", "", {
        templateData: {
          name: data.name,
          email: data.email,
          phone: data.phone || "—",
          projectType: data.project_type || "—",
          message: data.message,
        },
        idempotencyKey: `contact-notification-${inserted.id}`,
        replyTo: data.email,
      });
    } catch (mailError) {
      // A mensagem já foi salva; falha de e-mail não deve quebrar o envio.
      console.error("[contact] falha ao enviar notificação por e-mail", mailError);
    }

    return { ok: true } as const;
  });
