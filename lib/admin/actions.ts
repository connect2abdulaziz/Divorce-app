"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/admin/current-staff";
import { createClient } from "@/lib/supabase/server";

export async function markCaseCompleted(caseId: string) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase
    .from("cases")
    .update({ questionnaire_status: "completed", completed_at: new Date().toISOString() } as never)
    .eq("id", caseId);
  if (error) throw error;
  revalidatePath("/admin", "layout");
}

export async function reopenCase(caseId: string) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase
    .from("cases")
    .update({ questionnaire_status: "in_progress", completed_at: null } as never)
    .eq("id", caseId);
  if (error) throw error;
  revalidatePath("/admin", "layout");
}

export async function deleteCase(caseId: string) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("cases").delete().eq("id", caseId);
  if (error) throw error;
  revalidatePath("/admin", "layout");
  redirect("/admin");
}
