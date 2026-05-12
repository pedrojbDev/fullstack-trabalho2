import { getCurrentUserOrThrow } from "@/modules/_shared/session";
import { agendaSettingsSchema } from "./validations";

export async function getAgendaSettings() {
  const { supabase, user } = await getCurrentUserOrThrow();
  const { data, error } = await supabase
    .from("agenda_settings")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateAgendaSettingsService(input: unknown) {
  const parsed = agendaSettingsSchema.parse(input);
  const { supabase, user } = await getCurrentUserOrThrow();
  const existing = await supabase
    .from("agenda_settings")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing.data?.id) {
    const { data, error } = await supabase
      .from("agenda_settings")
      .update(parsed)
      .eq("id", existing.data.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
  const { data, error } = await supabase
    .from("agenda_settings")
    .insert({ ...parsed, user_id: user.id })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}
