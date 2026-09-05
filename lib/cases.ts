import { createClient } from "@/lib/supabase/server";

// One case per client for now. Called from the questionnaire landing page
// right after login/signup so there's always a case to attach answers to.
export async function getOrCreateCase(userId: string) {
  const supabase = await createClient();

  const { data: existing, error: selectError } = await supabase
    .from("cases")
    .select("*")
    .eq("client_id", userId)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existing) return existing;

  const { data: created, error: insertError } = await supabase
    .from("cases")
    .insert({ client_id: userId })
    .select()
    .single();

  if (insertError) throw insertError;
  return created;
}
