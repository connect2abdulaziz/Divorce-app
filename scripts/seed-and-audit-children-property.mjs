/**
 * Fill the new explicit-answer fields on Audit ChildrenProperty with fictional
 * values, then re-run fill verification + PDF generation.
 *
 *   node scripts/seed-and-audit-children-property.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { spawnSync } from "child_process";

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

const CASE_ID = "72abe72f-3ec8-4658-9c29-0b730f700fc4";

console.log("Seeding explicit answers on Audit ChildrenProperty…");

const { error: marriageErr } = await supabase
  .from("marriage")
  .update({
    is_covenant_marriage: false,
    conciliation_attempted: true,
    spousal_maintenance_requested: false,
    spousal_maintenance_for: null,
  })
  .eq("case_id", CASE_ID);
if (marriageErr) throw marriageErr;

const { error: parentingErr } = await supabase
  .from("parenting")
  .update({
    child_support_payer: "spouse",
    has_existing_child_support_order: false,
    has_dui_or_drug_conviction: false,
    transportation_provider: "shared",
    advance_notice_days: 10,
    vacation_weeks: 2,
    vacation_notice_days: 21,
    summer_schedule_same: true,
    summer_schedule_notes: null,
    visitation_wanted: true,
    parenting_time_schedule:
      "Party A: weekdays and alternate weekends. Party B: every other weekend Friday 6:00 PM to Sunday 6:00 PM. Exchanges at school on Fridays and at Party A's residence on Sundays.",
  })
  .eq("case_id", CASE_ID);
if (parentingErr) throw parentingErr;

const { error: taxErr } = await supabase
  .from("tax_information")
  .update({
    dependents_claimed_by: "split",
    claim_frequency: "alternate_years",
    even_year_claimant: "client",
    notes: "Audit ChildrenProperty claims even years; Sample claims odd years.",
  })
  .eq("case_id", CASE_ID);
if (taxErr) throw taxErr;

const { error: dvErr } = await supabase
  .from("domestic_violence")
  .update({ has_domestic_violence: false })
  .eq("case_id", CASE_ID);
if (dvErr) throw dvErr;

// Ensure home phone stays blank (do not copy cell).
const { error: phoneErr } = await supabase
  .from("party_client")
  .update({ home_phone: null })
  .eq("case_id", CASE_ID);
if (phoneErr) throw phoneErr;

const { data: estateRows, error: estateListErr } = await supabase
  .from("real_estate")
  .select("id, address")
  .eq("case_id", CASE_ID);
if (estateListErr) throw estateListErr;
for (const row of estateRows ?? []) {
  const { error } = await supabase
    .from("real_estate")
    .update({
      legal_description: `Lot 7, Block 2 of Example Heights, as recorded in Book 123 of Maps, Page 45, records of Maricopa County, Arizona (${row.address})`,
    })
    .eq("id", row.id);
  if (error) throw error;
}

const { data: vehicles, error: vehicleListErr } = await supabase
  .from("vehicles")
  .select("id, make, model")
  .eq("case_id", CASE_ID)
  .order("created_at");
if (vehicleListErr) throw vehicleListErr;
const vehicleSeeds = [
  { vin: "1HGCM82633A004352", lienholder: "Ally Financial" },
  { vin: "5YJSA1E14HF000321", lienholder: null },
];
for (let i = 0; i < (vehicles ?? []).length; i++) {
  const seed = vehicleSeeds[i] ?? {
    vin: `TESTVIN00000000${i + 1}`,
    lienholder: null,
  };
  const { error } = await supabase
    .from("vehicles")
    .update(seed)
    .eq("id", vehicles[i].id);
  if (error) throw error;
}

console.log("Seed complete. Re-running live audit…");
const result = spawnSync("node", ["scripts/audit-live-wc-case.mjs"], {
  encoding: "utf8",
  shell: true,
});
process.stdout.write(result.stdout || "");
process.stderr.write(result.stderr || "");
process.exit(result.status ?? 1);
