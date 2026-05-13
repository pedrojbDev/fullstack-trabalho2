import { getCurrentUserOrThrow } from "@/backend/modules/_shared/session";
import { blockedTimeSchema } from "./validations";

export async function createBlockedTimeService(input: unknown) {
  const parsed = blockedTimeSchema.parse(input);
  const { supabase, user } = await getCurrentUserOrThrow();
  const { data, error } = await supabase
    .from("blocked_times")
    .insert({ ...parsed, user_id: user.id })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function listBlockedTimes() {
  const { supabase, user } = await getCurrentUserOrThrow();
  const { data, error } = await supabase
    .from("blocked_times")
    .select("*, spaces(name)")
    .eq("user_id", user.id)
    .order("date", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}
