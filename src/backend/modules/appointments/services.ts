import { getCurrentUserOrThrow } from "@/backend/modules/_shared/session";
import { appointmentSchema } from "./validations";

async function hasConflict(
  userId: string,
  spaceId: string,
  date: string,
  start: string,
  end: string,
  ignoreId?: string,
) {
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

  const conflict = await hasConflict(
    user.id,
    parsed.space_id,
    parsed.date,
    parsed.start_time,
    parsed.end_time,
  );
  if (conflict) throw new Error("Conflito de horário: já existe agendamento/bloqueio nesse período");

  const { data, error } = await supabase
    .from("appointments")
    .insert({ ...parsed, user_id: user.id })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateAppointmentService(id: string, input: unknown) {
  const parsed = appointmentSchema.partial().parse(input);
  const { supabase, user } = await getCurrentUserOrThrow();
  const current = await supabase
    .from("appointments")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (current.error || !current.data) throw new Error("Compromisso não encontrado");

  const merged = { ...current.data, ...parsed };
  const conflict = await hasConflict(
    user.id,
    merged.space_id,
    merged.date,
    merged.start_time,
    merged.end_time,
    id,
  );
  if (conflict) throw new Error("Conflito de horário: já existe agendamento/bloqueio nesse período");

  const { data, error } = await supabase
    .from("appointments")
    .update(parsed)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateAppointmentStatus(
  id: string,
  status: "cancelled" | "confirmed" | "completed",
) {
  const { supabase, user } = await getCurrentUserOrThrow();
  const { data, error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}
