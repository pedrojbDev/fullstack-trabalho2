import { getCurrentUserOrThrow } from "@/backend/modules/_shared/session";
import { spaceSchema } from "./validations";

export async function listSpaces() {
  const { supabase, user } = await getCurrentUserOrThrow();
  const { data, error } = await supabase
    .from("spaces")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_archived", false)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function createSpaceService(input: unknown) {
  const parsed = spaceSchema.parse(input);
  const { supabase, user } = await getCurrentUserOrThrow();
  const { data, error } = await supabase
    .from("spaces")
    .insert({ ...parsed, user_id: user.id })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateSpaceService(id: string, input: unknown) {
  const parsed = spaceSchema.partial().parse(input);
  const { supabase, user } = await getCurrentUserOrThrow();
  const { data, error } = await supabase
    .from("spaces")
    .update(parsed)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function archiveSpace(id: string) {
  const { supabase, user } = await getCurrentUserOrThrow();
  const { error } = await supabase
    .from("spaces")
    .update({ is_archived: true, is_active: false })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
}
