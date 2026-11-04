/**
 * Find WC cases (esp. "Audit ChildrenProperty"), validate fill values, and
 * compare petition/parenting fields against saved answers.
 *
 *   node scripts/audit-live-wc-case.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

function loadEnv() {
  const text = readFileSync(".env.local", "utf8");
  const env = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

const env = loadEnv();
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function loadBundle(caseId) {
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
  const gates = {
    hasCommonChildren: kase.has_common_children,
    isSpousePregnant: kase.is_spouse_pregnant,
    clientEmploymentStatus: employmentRes.data?.client_status ?? null,
    spouseEmploymentStatus: employmentRes.data?.spouse_status ?? null,
    hasDomesticViolence:
      typeof dvRes.data?.has_domestic_violence === "boolean"
        ? dvRes.data.has_domestic_violence
        : null,
    hasCommunityProperty: kase.has_community_property,
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
}

function nameOf(party) {
  if (!party) return "";
  return [party.first_name, party.middle_name, party.last_name].filter(Boolean).join(" ");
}

const { data: parties, error: partyErr } = await supabase
  .from("party_client")
  .select("case_id, first_name, middle_name, last_name")
  .or(
    "first_name.ilike.%Audit%,last_name.ilike.%Audit%,first_name.ilike.%ChildrenProperty%,last_name.ilike.%ChildrenProperty%"
  );
if (partyErr) throw partyErr;

const { data: wcCases, error: wcErr } = await supabase
  .from("cases")
  .select("id, has_common_children, has_community_property, questionnaire_status, last_completed_section, client_id")
  .eq("has_common_children", true)
  .order("updated_at", { ascending: false })
  .limit(25);
if (wcErr) throw wcErr;

console.log("WC cases with children:", wcCases?.length ?? 0);
for (const c of wcCases ?? []) {
  const { data: client } = await supabase
    .from("party_client")
    .select("first_name, middle_name, last_name")
    .eq("case_id", c.id)
    .maybeSingle();
  console.log(
    `- ${c.id.slice(0, 8)}… ${nameOf(client) || "(no party)"} status=${c.questionnaire_status} community=${c.has_community_property} last=${c.last_completed_section}`
  );
}

console.log("\nName matches for Audit*:", parties);

// Prefer explicit CASE_ID, then exact Audit ChildrenProperty name.
const childrenProperty = (parties ?? []).find(
  (p) => String(p.last_name || "") === "ChildrenProperty"
);
let targetId =
  process.env.CASE_ID ||
  childrenProperty?.case_id ||
  wcCases?.find((c) => c.has_community_property === true)?.id ||
  wcCases?.[0]?.id ||
  null;

if (!targetId) {
  console.error("No with-children case found.");
  process.exit(1);
}

console.log("\nAuditing case:", targetId);
const bundle = await loadBundle(targetId);

// Dynamic import compiled TS via tsx-less path: use child process instead.
const { spawnSync } = await import("child_process");
const fs = await import("fs");
const tmp = "tmp/live-case-bundle.json";
fs.mkdirSync("tmp", { recursive: true });
fs.writeFileSync(tmp, JSON.stringify(bundle, null, 2));

const result = spawnSync(
  "npx",
  ["tsx", "scripts/audit-live-wc-case-fill.ts", tmp],
  { encoding: "utf8", shell: true }
);
process.stdout.write(result.stdout || "");
process.stderr.write(result.stderr || "");
process.exit(result.status ?? 1);
