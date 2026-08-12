import { auth } from "@auth";
import { supabaseServer } from "./supabase";

export async function isAdminEmail(email?: string | null): Promise<boolean> {
  if (!email) return false;

  const supabase = supabaseServer();
  if (!supabase) return false;

  const { data, error } = await supabase
    .from("admin")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.error("[admin-auth] failed to check admin email:", error.message);
    return false;
  }

  return !!data;
}

export async function getAdminSession() {
  const session = await auth();
  if (!session || !(await isAdminEmail(session.user?.email))) {
    return null;
  }

  return session;
}
