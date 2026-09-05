import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// SERVER-ONLY. Bypasses RLS entirely via the service role key.
// Only call this from trusted server code that has already verified the
// caller is staff/admin (e.g. inside a Server Action after checking the
// caller's profile role) — never expose this client or its key to the browser.
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
