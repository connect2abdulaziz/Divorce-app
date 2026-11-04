import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, mkdirSync } from "fs";

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

const { data: party } = await supabase
  .from("party_client")
  .select("case_id, first_name, last_name")
  .eq("last_name", "NoChildrenProperty")
  .maybeSingle();

const caseId = party?.case_id;
if (!caseId) {
  console.error("Case not found");
  process.exit(1);
}
console.log("case", caseId, party.first_name, party.last_name);

const tables = [
  "cases",
  "party_client",
  "party_spouse",
  "marriage",
  "employment",
  "domestic_violence",
  "parenting",
  "tax_information",
];
const records = [
  "real_estate",
  "vehicles",
  "retirement_accounts",
  "community_debts",
  "personal_property",
  "separate_property",
  "separate_debts",
  "children",
];

const out = { caseId };
for (const t of tables) {
  const q =
    t === "cases"
      ? supabase.from(t).select("*").eq("id", caseId).single()
      : supabase.from(t).select("*").eq("case_id", caseId).maybeSingle();
  const { data, error } = await q;
  if (error) console.log(t, error.message);
  out[t] = data;
}
for (const t of records) {
  const { data, error } = await supabase.from(t).select("*").eq("case_id", caseId).order("created_at");
  if (error) console.log(t, error.message);
  out[t] = data;
}

mkdirSync("tmp", { recursive: true });
writeFileSync("tmp/audit-nocp-bundle.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
