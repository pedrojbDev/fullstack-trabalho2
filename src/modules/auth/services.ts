import { createClient } from "@/shared/lib/supabase/server";
import { loginSchema, signupSchema } from "./validations";

export async function loginService(input: unknown) {
  const parsed = loginSchema.parse(input);
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed);
  if (error) throw new Error(error.message);
  return data;
}

export async function signupService(input: unknown) {
  const parsed = signupSchema.parse(input);
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.email,
    password: parsed.password,
    options: { data: { full_name: parsed.name } },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function logoutService() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
