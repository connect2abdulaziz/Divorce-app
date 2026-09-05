import { createClient } from "@/lib/supabase/server";
import type { CaseGates } from "./steps";
import { cache } from "react";

const SINGLETON_TABLES = [
  "party_client",
  "party_spouse",
  "marriage",
  "employment",
  "domestic_violence",
  "parenting",
  "tax_information",
] as const;

const REPEATABLE_TABLES = [
  "children",
  "real_estate",
  "vehicles",
  "retirement_accounts",
  "community_debts",
  "personal_property",
  "separate_property",
  "separate_debts",
] as const;

export type SingletonTable = (typeof SINGLETON_TABLES)[number];
export type RepeatableTable = (typeof REPEATABLE_TABLES)[number];

export function isSingletonTable(t: string): t is SingletonTable {
  return (SINGLETON_TABLES as readonly string[]).includes(t);
}

export function isRepeatableTable(t: string): t is RepeatableTable {
  return (REPEATABLE_TABLES as readonly string[]).includes(t);
}

// Everything the questionnaire layout and every section page need, fetched
// once per request. RLS already restricts every one of these queries to the
// signed-in client's own case (or staff), so no extra ownership checks here.
export const loadCaseBundle = cache(async (caseId: string) => {
  const supabase = await createClient();

  const [
    caseRes,
    partyClientRes,
    partySpouseRes,
    marriageRes,
    employmentRes,
    dvRes,
    parentingRes,
    taxRes,
    childrenRes,
    realEstateRes,
    vehiclesRes,
    retirementRes,
    debtsRes,
    propertyRes,
    sepPropertyRes,
    sepDebtsRes,
  ] = await Promise.all([
    supabase.from("cases").select("*").eq("id", caseId).single(),
    supabase.from("party_client").select("*").eq("case_id", caseId).single(),
    supabase.from("party_spouse").select("*").eq("case_id", caseId).single(),
    supabase.from("marriage").select("*").eq("case_id", caseId).single(),
    supabase.from("employment").select("*").eq("case_id", caseId).single(),
    supabase.from("domestic_violence").select("*").eq("case_id", caseId).single(),
    supabase.from("parenting").select("*").eq("case_id", caseId).single(),
    supabase.from("tax_information").select("*").eq("case_id", caseId).single(),
    supabase.from("children").select("*, child_residences(*)").eq("case_id", caseId).order("created_at"),
    supabase.from("real_estate").select("*").eq("case_id", caseId).order("created_at"),
    supabase.from("vehicles").select("*").eq("case_id", caseId).order("created_at"),
    supabase.from("retirement_accounts").select("*").eq("case_id", caseId).order("created_at"),
    supabase.from("community_debts").select("*").eq("case_id", caseId).order("created_at"),
    supabase.from("personal_property").select("*").eq("case_id", caseId).order("created_at"),
    supabase.from("separate_property").select("*").eq("case_id", caseId).order("created_at"),
    supabase.from("separate_debts").select("*").eq("case_id", caseId).order("created_at"),
  ]);

  if (caseRes.error) throw caseRes.error;

  const kase = caseRes.data;

  const gates: CaseGates = {
    hasCommonChildren: kase.has_common_children,
    isSpousePregnant: kase.is_spouse_pregnant,
    clientEmploymentStatus: employmentRes.data?.client_status ?? null,
    spouseEmploymentStatus: employmentRes.data?.spouse_status ?? null,
    hasDomesticViolence: dvRes.data?.has_domestic_violence ?? false,
    hasRealEstate: kase.has_real_estate,
    hasVehicles: kase.has_vehicles,
    hasRetirementAccounts: kase.has_retirement_accounts,
    hasCommunityDebts: kase.has_community_debts,
    hasHouseholdProperty: kase.has_household_property,
    hasSeparateProperty: kase.has_separate_property,
    hasSeparateDebts: kase.has_separate_debts,
  };

  return {
    kase,
    gates,
    sections: {
      party_client: partyClientRes.data,
      party_spouse: partySpouseRes.data,
      marriage: marriageRes.data,
      employment: employmentRes.data,
      domestic_violence: dvRes.data,
      parenting: parentingRes.data,
      tax_information: taxRes.data,
    },
    records: {
      children: childrenRes.data ?? [],
      real_estate: realEstateRes.data ?? [],
      vehicles: vehiclesRes.data ?? [],
      retirement_accounts: retirementRes.data ?? [],
      community_debts: debtsRes.data ?? [],
      personal_property: propertyRes.data ?? [],
      separate_property: sepPropertyRes.data ?? [],
      separate_debts: sepDebtsRes.data ?? [],
    },
  };
});

export type CaseBundle = Awaited<ReturnType<typeof loadCaseBundle>>;
