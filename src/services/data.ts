import { createClient } from "@/lib/supabase/server";
import { appointmentSchema, blockedTimeSchema, clientSchema, spaceSchema, agendaSettingsSchema, reminderSchema } from "@/lib/validations/schemas";

export async function getCurrentUserOrThrow() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    throw new Error("Usuário não autenticado");
  }
  return { supabase, user: data.user };
}

export async function listClients() {
  const { supabase, user } = await getCurrentUserOrThrow();
  const { data, error } = await supabase.from("clients").select("*").eq("user_id", user.id).eq("is_archived", false).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function createClientService(input: unknown) {
  const parsed = clientSchema.parse(input);
  const { supabase, user } = await getCurrentUserOrThrow();
  const { data, error } = await supabase.from("clients").insert({ ...parsed, user_id: user.id, email: parsed.email || null }).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateClientService(id: string, input: unknown) {
  const parsed = clientSchema.partial().parse(input);
  const { supabase, user } = await getCurrentUserOrThrow();
  const { data, error } = await supabase.from("clients").update(parsed).eq("id", id).eq("user_id", user.id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function archiveClient(id: string) {
  const { supabase, user } = await getCurrentUserOrThrow();
  const { error } = await supabase.from("clients").update({ is_archived: true }).eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);
}

export async function listSpaces() {
  const { supabase, user } = await getCurrentUserOrThrow();
  const { data, error } = await supabase.from("spaces").select("*").eq("user_id", user.id).eq("is_archived", false).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function createSpaceService(input: unknown) {
  const parsed = spaceSchema.parse(input);
  const { supabase, user } = await getCurrentUserOrThrow();
  const { data, error } = await supabase.from("spaces").insert({ ...parsed, user_id: user.id }).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateSpaceService(id: string, input: unknown) {
  const parsed = spaceSchema.partial().parse(input);
  const { supabase, user } = await getCurrentUserOrThrow();
  const { data, error } = await supabase.from("spaces").update(parsed).eq("id", id).eq("user_id", user.id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function archiveSpace(id: string) {
  const { supabase, user } = await getCurrentUserOrThrow();
  const { error } = await supabase.from("spaces").update({ is_archived: true, is_active: false }).eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);
}

async function hasConflict(userId: string, spaceId: string, date: string, start: string, end: string, ignoreId?: string) {
  const { supabase } = await getCurrentUserOrThrow();
  let q = supabase
    .from("appointments")
    .select("id,start_time,end_time,status")
    .eq("user_id", userId)
    .eq("space_id", spaceId)
    .eq("date", date)
    .in("status", ["scheduled", "confirmed", "pending", "completed"])
    .lt("start_time", end)
    .gt("end_time", start);

  if (ignoreId) q = q.neq("id", ignoreId);

  const { data: overlaps, error } = await q;
  if (error) throw new Error(error.message);

  const { data: blocked, error: blockedErr } = await supabase
    .from("blocked_times")
    .select("id")
    .eq("user_id", userId)
    .eq("date", date)
    .lt("start_time", end)
    .gt("end_time", start)
    .or(`space_id.eq.${spaceId},space_id.is.null`);

  if (blockedErr) throw new Error(blockedErr.message);

  return (overlaps?.length ?? 0) > 0 || (blocked?.length ?? 0) > 0;
}

export async function listAppointments() {
  const { supabase, user } = await getCurrentUserOrThrow();
  const { data, error } = await supabase
    .from("appointments")
    .select("*, clients(name), spaces(name)")
    .eq("user_id", user.id)
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function createAppointmentService(input: unknown) {
  const parsed = appointmentSchema.parse(input);
  const { supabase, user } = await getCurrentUserOrThrow();

  const { data: space } = await supabase
    .from("spaces")
    .select("is_active")
    .eq("id", parsed.space_id)
    .eq("user_id", user.id)
    .single();
  if (!space?.is_active) throw new Error("Espaço inativo não pode receber agendamento");

  const conflict = await hasConflict(user.id, parsed.space_id, parsed.date, parsed.start_time, parsed.end_time);
  if (conflict) throw new Error("Conflito de horário: já existe agendamento/bloqueio nesse período");

  const { data, error } = await supabase.from("appointments").insert({ ...parsed, user_id: user.id }).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateAppointmentService(id: string, input: unknown) {
  const parsed = appointmentSchema.partial().parse(input);
  const { supabase, user } = await getCurrentUserOrThrow();
  const current = await supabase.from("appointments").select("*").eq("id", id).eq("user_id", user.id).single();
  if (current.error || !current.data) throw new Error("Compromisso não encontrado");

  const merged = { ...current.data, ...parsed };
  const conflict = await hasConflict(user.id, merged.space_id, merged.date, merged.start_time, merged.end_time, id);
  if (conflict) throw new Error("Conflito de horário: já existe agendamento/bloqueio nesse período");

  const { data, error } = await supabase.from("appointments").update(parsed).eq("id", id).eq("user_id", user.id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateAppointmentStatus(id: string, status: "cancelled" | "confirmed" | "completed") {
  const { supabase, user } = await getCurrentUserOrThrow();
  const { data, error } = await supabase.from("appointments").update({ status }).eq("id", id).eq("user_id", user.id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function createBlockedTimeService(input: unknown) {
  const parsed = blockedTimeSchema.parse(input);
  const { supabase, user } = await getCurrentUserOrThrow();
  const { data, error } = await supabase.from("blocked_times").insert({ ...parsed, user_id: user.id }).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function listBlockedTimes() {
  const { supabase, user } = await getCurrentUserOrThrow();
  const { data, error } = await supabase.from("blocked_times").select("*, spaces(name)").eq("user_id", user.id).order("date", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function getAgendaSettings() {
  const { supabase, user } = await getCurrentUserOrThrow();
  const { data, error } = await supabase.from("agenda_settings").select("*").eq("user_id", user.id).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateAgendaSettingsService(input: unknown) {
  const parsed = agendaSettingsSchema.parse(input);
  const { supabase, user } = await getCurrentUserOrThrow();
  const existing = await supabase.from("agenda_settings").select("id").eq("user_id", user.id).maybeSingle();
  if (existing.data?.id) {
    const { data, error } = await supabase.from("agenda_settings").update(parsed).eq("id", existing.data.id).select().single();
    if (error) throw new Error(error.message);
    return data;
  }
  const { data, error } = await supabase.from("agenda_settings").insert({ ...parsed, user_id: user.id }).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function createReminderService(input: unknown) {
  const parsed = reminderSchema.parse(input);
  const { supabase } = await getCurrentUserOrThrow();
  const { data, error } = await supabase.from("reminders").insert({ ...parsed, status: "pending" }).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function simulateSendReminderService(id: string) {
  const { supabase } = await getCurrentUserOrThrow();
  const { data, error } = await supabase.from("reminders").update({ status: "sent", sent_at: new Date().toISOString(), message: "Envio simulado com sucesso" }).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

