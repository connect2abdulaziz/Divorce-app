/**
 * Apply migration 0016 using the Supabase SQL endpoint via service role is not
 * possible through PostgREST. This script instead verifies whether columns exist
 * by selecting them; if missing, prints the SQL to run in the dashboard.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

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

const probes = [
  ["marriage", "is_covenant_marriage"],
  ["marriage", "conciliation_attempted"],
  ["marriage", "spousal_maintenance_requested"],
  ["parenting", "child_support_payer"],
  ["parenting", "transportation_provider"],
  ["tax_information", "even_year_claimant"],
  ["real_estate", "legal_description"],
  ["vehicles", "vin"],
  ["vehicles", "lienholder"],
];

let missing = false;
for (const [table, col] of probes) {
  const { error } = await supabase.from(table).select(col).limit(1);
  if (error) {
    missing = true;
    console.log(`MISSING ${table}.${col}: ${error.message}`);
  } else {
    console.log(`ok ${table}.${col}`);
  }
}

const { data: cases, error: caseErr } = await supabase
  .from("cases")
  .select("id, title, has_common_children, questionnaire_status, last_completed_section")
  .ilike("title", "%Audit%Children%")
  .limit(5);
console.log("\nAudit cases:", caseErr?.message || cases);

if (missing) {
  console.log("\nRun supabase/migrations/0016_intake_explicit_answers.sql in the Supabase SQL editor.");
  process.exit(2);
}
console.log("\nMigration columns present.");
