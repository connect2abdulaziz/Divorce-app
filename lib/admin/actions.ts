"use server";

import { revalidatePath } from "next/cache";
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

export async function deleteCase(
  caseId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("cases").delete().eq("id", caseId);
  if (error) {
    return {
      ok: false,
      error:
        error.message.includes("audit_log_case_id_fkey") || error.code === "23503"
          ? "Case delete is blocked by a database audit rule. Apply migration 0012_fix_case_delete_audit.sql in Supabase, then try again."
          : error.message,
    };
  }
  // Do not revalidate the admin layout here — that would re-render this
  // case page after the row is gone and crash the Server Component tree.
  return { ok: true };
}
