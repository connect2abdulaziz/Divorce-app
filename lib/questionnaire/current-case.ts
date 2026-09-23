import { cache } from "react";
import { redirect } from "next/navigation";
import { resolveActiveCaseId } from "@/lib/cases";
import { createClient } from "@/lib/supabase/server";

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  return user;
});

/** Questionnaire routes require an active case; otherwise send the client to the dashboard. */
export const getCurrentUserAndCase = cache(async () => {
  const user = await getCurrentUser();
  const caseId = await resolveActiveCaseId(user.id);
  if (!caseId) redirect("/dashboard");
  return { user, caseId };
});
