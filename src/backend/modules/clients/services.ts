import { getCurrentUserOrThrow } from "@/backend/modules/_shared/session";
import { clientSchema } from "./validations";

export async function listClients() {
  const { supabase, user } = await getCurrentUserOrThrow();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_archived", false)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function createClientService(input: unknown) {
  const parsed = clientSchema.parse(input);
  const { supabase, user } = await getCurrentUserOrThrow();
  const { data, error } = await supabase
    .from("clients")
    .insert({ ...parsed, user_id: user.id, email: parsed.email || null })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateClientService(id: string, input: unknown) {
  const parsed = clientSchema.partial().parse(input);
  const { supabase, user } = await getCurrentUserOrThrow();
  const { data, error } = await supabase
    .from("clients")
    .update(parsed)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function archiveClient(id: string) {
  const { supabase, user } = await getCurrentUserOrThrow();
  const { error } = await supabase
    .from("clients")
    .update({ is_archived: true })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
}
