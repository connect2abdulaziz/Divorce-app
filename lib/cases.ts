import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export const ACTIVE_CASE_COOKIE = "ldd_active_case";

export type CaseRow = {
  id: string;
  client_id: string;
  questionnaire_status: "in_progress" | "submitted" | "completed";
  last_completed_section: string | null;
  submitted_at: string | null;
  completed_at: string | null;
  last_saved_at: string;
  created_at: string;
  updated_at: string;
  has_common_children: boolean | null;
  is_spouse_pregnant: boolean | null;
  has_community_property: boolean | null;
  has_real_estate: boolean | null;
  has_vehicles: boolean | null;
  has_retirement_accounts: boolean | null;
  has_community_debts: boolean | null;
  has_household_property: boolean | null;
  has_separate_property: boolean | null;
  has_separate_debts: boolean | null;
};

export type CaseListItem = CaseRow & {
  party_client:
    | { first_name: string | null; last_name: string | null }
    | { first_name: string | null; last_name: string | null }[]
    | null;
};

function firstRel<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export function caseDisplayName(item: CaseListItem) {
  const party = firstRel(item.party_client);
  const name = [party?.first_name, party?.last_name].filter(Boolean).join(" ");
  return name || "Arizona divorce questionnaire";
}

export async function setActiveCaseCookie(caseId: string) {
  const jar = await cookies();
  jar.set(ACTIVE_CASE_COOKIE, caseId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function clearActiveCaseCookie() {
  const jar = await cookies();
  jar.delete(ACTIVE_CASE_COOKIE);
}

export async function getActiveCaseIdFromCookie() {
  const jar = await cookies();
  return jar.get(ACTIVE_CASE_COOKIE)?.value ?? null;
}

export async function listClientCases(userId: string): Promise<CaseListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cases")
    .select("*, party_client(first_name, last_name)")
    .eq("client_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as CaseListItem[];
}

export async function getOwnedCase(userId: string, caseId: string): Promise<CaseRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("id", caseId)
    .eq("client_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data as CaseRow | null;
}

export async function createCase(userId: string): Promise<CaseRow> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cases")
    .insert({ client_id: userId })
    .select("*")
    .single();

  if (error) throw error;
  return data as CaseRow;
}

/** Resolve which case the questionnaire should use (cookie → in-progress → newest). */
export async function resolveActiveCaseId(userId: string): Promise<string | null> {
  const preferred = await getActiveCaseIdFromCookie();
  if (preferred) {
    const owned = await getOwnedCase(userId, preferred);
    if (owned) return owned.id;
  }

  const cases = await listClientCases(userId);
  if (!cases.length) return null;

  const inProgress = cases.find((c) => c.questionnaire_status === "in_progress");
  return (inProgress ?? cases[0]).id;
}
