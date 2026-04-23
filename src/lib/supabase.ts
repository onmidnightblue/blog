import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;

let browserClient: SupabaseClient | null = null;

export const supabaseBrowser = () => {
  if (browserClient) return browserClient;
  browserClient = createClient(supabaseUrl, supabasePublicKey);
  return browserClient;
};

export const supabaseServer = () => {
  if (typeof window !== "undefined") return null;
  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: { persistSession: false },
  });
};
