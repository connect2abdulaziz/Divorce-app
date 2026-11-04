/**
 * Local WOC fill verification using the dumped case + in-memory answers
 * (works even before migration 0017 is applied).
 *
 *   node scripts/audit-woc-nocp-local.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { spawnSync } from "child_process";

const dump = spawnSync("node", ["scripts/dump-woc-case.mjs"], { encoding: "utf8", shell: true });
if (dump.status !== 0) {
  process.stderr.write(dump.stderr || dump.stdout || "");
  process.exit(dump.status ?? 1);
}

const raw = JSON.parse(readFileSync("tmp/audit-nocp-bundle.json", "utf8"));
raw.marriage = {
  ...raw.marriage,
  is_covenant_marriage: false,
  conciliation_attempted: true,
  spousal_maintenance_requested: false,
  spousal_maintenance_for: null,
  has_written_agreement: false,
};
raw.tax_information = {
  ...raw.tax_information,
  going_forward_filing: "separate",
  previous_years_filing: "joint",
  filing_status: "separate",
};
if (raw.real_estate?.[0]) {
  raw.real_estate[0].legal_description =
    "Lot 9, Block 1, Example Heights, Book 88 of Maps, Page 12, records of Maricopa County, Arizona";
}

const kase = raw.cases;
const bundle = {
  kase,
  gates: {
    hasCommonChildren: kase.has_common_children,
    isSpousePregnant: kase.is_spouse_pregnant,
    clientEmploymentStatus: raw.employment?.client_status ?? null,
    spouseEmploymentStatus: raw.employment?.spouse_status ?? null,
    hasDomesticViolence:
      typeof raw.domestic_violence?.has_domestic_violence === "boolean"
        ? raw.domestic_violence.has_domestic_violence
        : null,
    hasCommunityProperty: kase.has_community_property,
    hasRealEstate: kase.has_real_estate,
    hasVehicles: kase.has_vehicles,
    hasRetirementAccounts: kase.has_retirement_accounts,
    hasCommunityDebts: kase.has_community_debts,
    hasHouseholdProperty: kase.has_household_property,
    hasSeparateProperty: kase.has_separate_property,
    hasSeparateDebts: kase.has_separate_debts,
  },
  sections: {
    party_client: raw.party_client,
    party_spouse: raw.party_spouse,
    marriage: raw.marriage,
    employment: raw.employment,
    domestic_violence: raw.domestic_violence,
    parenting: raw.parenting,
    tax_information: raw.tax_information,
  },
  records: {
    children: raw.children ?? [],
    real_estate: raw.real_estate ?? [],
    vehicles: raw.vehicles ?? [],
    retirement_accounts: raw.retirement_accounts ?? [],
    community_debts: raw.community_debts ?? [],
    personal_property: raw.personal_property ?? [],
    separate_property: raw.separate_property ?? [],
    separate_debts: raw.separate_debts ?? [],
  },
};

mkdirSync("tmp", { recursive: true });
writeFileSync("tmp/woc-live-bundle.json", JSON.stringify(bundle, null, 2));
const result = spawnSync("npx", ["tsx", "scripts/audit-woc-nocp-fill.ts", "tmp/woc-live-bundle.json"], {
  encoding: "utf8",
  shell: true,
});
process.stdout.write(result.stdout || "");
process.stderr.write(result.stderr || "");
process.exit(result.status ?? 1);
