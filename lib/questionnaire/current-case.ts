import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateCase } from "@/lib/cases";

export const getCurrentUserAndCase = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const kase = await getOrCreateCase(user.id);
  return { user, caseId: kase.id as string };
});
