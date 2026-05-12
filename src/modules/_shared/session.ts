import { createClient } from "@/shared/lib/supabase/server";

export async function getCurrentUserOrThrow() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    throw new Error("Usuário não autenticado");
  }
  return { supabase, user: data.user };
}
