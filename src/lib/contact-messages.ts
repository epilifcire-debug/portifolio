import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type ContactMessage = Tables<"contact_messages">;

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe seu nome")
    .max(100, "Nome deve ter menos de 100 caracteres"),
  email: z
    .string()
    .trim()
    .email("E-mail inválido")
    .max(255, "E-mail deve ter menos de 255 caracteres"),
  phone: z.string().trim().max(30, "Telefone muito longo").optional(),
  project_type: z.string().trim().max(80).optional(),
  message: z
    .string()
    .trim()
    .min(10, "Descreva sua ideia em pelo menos 10 caracteres")
    .max(2000, "Mensagem deve ter menos de 2000 caracteres"),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

export async function submitContactMessage(input: ContactFormInput): Promise<void> {
  const data = contactFormSchema.parse(input);
  const { error } = await supabase.from("contact_messages").insert({
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    project_type: data.project_type || null,
    message: data.message,
  });
  if (error) throw error;
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ContactMessage[];
}

export async function markMessageRead(id: string, isRead: boolean): Promise<void> {
  const { error } = await supabase.from("contact_messages").update({ is_read: isRead }).eq("id", id);
  if (error) throw error;
}

export async function deleteContactMessage(id: string): Promise<void> {
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) throw error;
}
