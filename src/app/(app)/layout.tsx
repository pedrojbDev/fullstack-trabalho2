import { redirect } from "next/navigation";
import { createClient } from "@/backend/lib/supabase/server";
import { AppShell } from "@/frontend/components/layout/app-shell";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return <AppShell userEmail={user.email}>{children}</AppShell>;
}
