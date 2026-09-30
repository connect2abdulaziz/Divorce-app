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

  // Prefer the RPC that skips audit triggers during CASCADE deletes.
  const { error } = await supabase.rpc("staff_delete_case" as never, {
    p_case_id: caseId,
  } as never);

  if (error) {
    // Fallback for environments that have not applied 0013 yet.
    if (error.message.includes("Could not find the function") || error.code === "PGRST202") {
      const { error: deleteError } = await supabase.from("cases").delete().eq("id", caseId);
      if (deleteError) {
        return {
          ok: false,
          error: `${deleteError.message}${deleteError.code ? ` (${deleteError.code})` : ""}`,
        };
      }
      return { ok: true };
    }

    return {
      ok: false,
      error: `${error.message}${error.code ? ` (${error.code})` : ""}`,
    };
  }

  // Do not revalidate the admin layout here — that would re-render this
  // case page after the row is gone and crash the Server Component tree.
  return { ok: true };
}
