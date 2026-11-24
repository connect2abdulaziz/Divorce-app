import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  ACTIVE_CASE_COOKIE,
  caseDisplayName,
  type CaseListItem,
  type CaseRow,
} from "@/lib/cases/shared";

export {
  ACTIVE_CASE_COOKIE,
  caseDisplayName,
  type CaseListItem,
  type CaseRow,
} from "@/lib/cases/shared";

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