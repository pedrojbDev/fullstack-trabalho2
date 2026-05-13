import { getCurrentUserOrThrow } from "@/backend/modules/_shared/session";
import { reminderSchema } from "./validations";

export async function createReminderService(input: unknown) {
  const parsed = reminderSchema.parse(input);
  const { supabase } = await getCurrentUserOrThrow();
  const { data, error } = await supabase
    .from("reminders")
    .insert({ ...parsed, status: "pending" })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function simulateSendReminderService(id: string) {
  const { supabase } = await getCurrentUserOrThrow();
  const { data, error } = await supabase
    .from("reminders")
    .update({
      status: "sent",
      sent_at: new Date().toISOString(),
      message: "Envio simulado com sucesso",
    })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}
