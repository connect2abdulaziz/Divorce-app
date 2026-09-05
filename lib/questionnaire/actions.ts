"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isRepeatableTable, isSingletonTable } from "./data";
import { isLaterStep } from "./steps";

async function touchCase(caseId: string, lastCompletedSection?: string) {
  const supabase = await createClient();
  const patch: Record<string, unknown> = { last_saved_at: new Date().toISOString() };

  if (lastCompletedSection) {
    const { data, error: readError } = await supabase
      .from("cases")
      .select("last_completed_section")
      .eq("id", caseId)
      .single();
    if (readError) throw readError;
    if (isLaterStep(lastCompletedSection, data.last_completed_section)) {
      patch.last_completed_section = lastCompletedSection;
    }
  }

  const { error } = await supabase.from("cases").update(patch).eq("id", caseId);
  if (error) throw error;
}

// Updates one of the always-present, one-row-per-case sections
// (party_client, party_spouse, marriage, employment, domestic_violence,
// parenting, tax_information). Pass lastCompletedSection (the step's own
// slug) when this save also represents "the client moved past this step".
export async function saveSingletonSection(
  table: string,
  caseId: string,
  values: Record<string, unknown>,
  lastCompletedSection?: string
) {
  if (!isSingletonTable(table)) throw new Error(`Unknown section table: ${table}`);

  const supabase = await createClient();
  const { error } = await supabase.from(table).update(values).eq("case_id", caseId);
  if (error) throw error;

  await touchCase(caseId, lastCompletedSection);
  revalidatePath("/questionnaire", "layout");
  revalidatePath("/admin", "layout");
}

// Column names on `cases` that updateCaseGates is allowed to touch.
type CaseGatesColumns = {
  has_common_children: boolean;
  is_spouse_pregnant: boolean;
  has_real_estate: boolean;
  has_vehicles: boolean;
  has_retirement_accounts: boolean;
  has_community_debts: boolean;
  has_household_property: boolean;
  has_separate_property: boolean;
  has_separate_debts: boolean;
};

// Updates the yes/no "gate" columns that live directly on cases
// (has_real_estate, has_vehicles, has_common_children, ...).
export async function updateCaseGates(
  caseId: string,
  values: Partial<CaseGatesColumns>,
  lastCompletedSection?: string
) {
  const supabase = await createClient();
  const { error } = await supabase.from("cases").update(values).eq("id", caseId);
  if (error) throw error;

  await touchCase(caseId, lastCompletedSection);
  revalidatePath("/questionnaire", "layout");
  revalidatePath("/admin", "layout");
}

// Adds one row to a repeatable-records table (vehicles, real_estate, ...).
export async function addRecord(table: string, caseId: string, values: Record<string, unknown>) {
  if (!isRepeatableTable(table)) throw new Error(`Unknown repeatable table: ${table}`);

  const supabase = await createClient();
  const { error } = await supabase.from(table).insert({ ...values, case_id: caseId });
  if (error) throw error;

  await touchCase(caseId);
  revalidatePath("/questionnaire", "layout");
  revalidatePath("/admin", "layout");
}

export async function updateRecord(table: string, id: string, values: Record<string, unknown>) {
  if (!isRepeatableTable(table)) throw new Error(`Unknown repeatable table: ${table}`);

  const supabase = await createClient();
  const { error } = await supabase.from(table).update(values).eq("id", id);
  if (error) throw error;

  revalidatePath("/questionnaire", "layout");
  revalidatePath("/admin", "layout");
}

export async function deleteRecord(table: string, id: string) {
  if (!isRepeatableTable(table)) throw new Error(`Unknown repeatable table: ${table}`);

  const supabase = await createClient();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/questionnaire", "layout");
  revalidatePath("/admin", "layout");
}

// A child's residence sub-records (child_residences).
export async function addChildResidence(childId: string, caseId: string, values: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("child_residences")
    .insert({ ...values, child_id: childId, case_id: caseId });
  if (error) throw error;
  revalidatePath("/questionnaire", "layout");
  revalidatePath("/admin", "layout");
}

export async function deleteChildResidence(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("child_residences").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/questionnaire", "layout");
  revalidatePath("/admin", "layout");
}

export async function submitQuestionnaire(caseId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("cases")
    .update({
      questionnaire_status: "submitted",
      submitted_at: new Date().toISOString(),
      last_completed_section: "submit",
    })
    .eq("id", caseId);
  if (error) throw error;

  revalidatePath("/questionnaire", "layout");
  revalidatePath("/admin", "layout");
  redirect("/questionnaire/submitted");
}

