/**
 * Quick verification of WC intake fill corrections (no PDF merge).
 *   npx tsx scripts/verify-intake-fixes.ts
 */
import { visibleSteps, percentComplete } from "../lib/questionnaire/steps";
import { buildTestCaseBundleWithChildren } from "../lib/documents/test-fixture";
import { buildCaseFillValues } from "../lib/documents/case-values";
import { validatePacket } from "../lib/documents/validate-packet";
import { petitionDrdc15Fields, parentingPlanFields } from "../lib/documents/fill-maps";

const gatesOpen = {
  hasCommonChildren: true,
  isSpousePregnant: false,
  clientEmploymentStatus: "employed",
  spouseEmploymentStatus: "employed",
  hasDomesticViolence: false as boolean | null,
  hasCommunityProperty: true,
  hasRealEstate: null as boolean | null,
  hasVehicles: null as boolean | null,
  hasRetirementAccounts: null as boolean | null,
  hasCommunityDebts: null as boolean | null,
  hasHouseholdProperty: null as boolean | null,
  hasSeparateProperty: null as boolean | null,
  hasSeparateDebts: null as boolean | null,
};
const gatesAfterNo = {
  ...gatesOpen,
  hasRealEstate: false,
  hasVehicles: false,
  hasRetirementAccounts: false,
  hasCommunityDebts: false,
  hasHouseholdProperty: false,
  hasSeparateProperty: false,
  hasSeparateDebts: false,
};

const nOpen = visibleSteps(gatesOpen).length;
const nAfter = visibleSteps(gatesAfterNo).length;
console.log("step totals open/after-no", nOpen, nAfter, "stable=", nOpen === nAfter);
console.log("percent at parenting", percentComplete(gatesOpen, "employment", "parenting"));
console.log("percent at client-info", percentComplete(gatesOpen, "review", "client-info"));

const bundle = buildTestCaseBundleWithChildren();
const v = buildCaseFillValues(bundle);
const issues = validatePacket(v);
console.log(
  "validation errors",
  issues.filter((i) => i.severity === "error").map((i) => i.code)
);
const p = petitionDrdc15Fields(v);
console.log("covenant", p["We do not have covenant marriage DRDC15f"]);
console.log("cs payer A", p["Party A OR_3 DRDC15f"], "B", p["Party B in a reasonable DRDC15f"]);
console.log("no CS order", p["To my knowledge there is no child support order DRDC15f"]);
console.log("no spousal", p["Neither party is entitled to spousal support DRDC15f"]);
console.log("VIN", p["VIN DRDC15f"], p["Lien Holder DRDC15f"]);
console.log("legal", p["1_2 DRDC15f"]);
console.log("tax even", p["in Tax Year 1 DRDC15f"], p["Party A_14 DRDC15f"]);
console.log("tax odd", p["in Tax Year 3 DRDC15f"], p["Party B_15 DRDC15f"]);
const pp = parentingPlanFields(v);
console.log(
  "summer same",
  pp["During summer months or school breaks that last longer than 4 days no changes shall be DRCVG11f"]
);
console.log(
  "notice",
  pp["Parents may change their timeshare arrangements by mutual agreement with at least DRCVG11f"]
);
console.log(
  "transport shared A",
  pp["Party A or DRCVG11f"],
  "B drop",
  pp["Party B will drop the minor children off at DRCVG11f"]
);
console.log("no default review months", pp["necessary or desired changes every"]);
console.log(
  "no default religious",
  pp["Both parents agree that religious arrangements are not applicable to this plan DRCVG11f"]
);

// Unanswered case: nothing auto-checked
const unanswered = buildCaseFillValues({
  ...bundle,
  sections: {
    ...bundle.sections,
    marriage: {
      ...bundle.sections.marriage,
      is_covenant_marriage: null,
      conciliation_attempted: null,
      spousal_maintenance_requested: null,
    },
    parenting: {
      ...bundle.sections.parenting,
      child_support_payer: null,
      has_existing_child_support_order: null,
      has_dui_or_drug_conviction: null,
      transportation_provider: null,
      advance_notice_days: null,
      vacation_weeks: null,
      vacation_notice_days: null,
      summer_schedule_same: null,
    },
    domestic_violence: {
      ...bundle.sections.domestic_violence,
      has_domestic_violence: null,
    },
    tax_information: {
      dependents_claimed_by: null,
      claim_frequency: null,
      even_year_claimant: null,
      notes: null,
    },
  },
});
const u = petitionDrdc15Fields(unanswered);
console.log("\n--- unanswered must stay blank ---");
console.log("covenant unchecked", u["We do not have covenant marriage DRDC15f"] !== true);
console.log("conciliation unchecked", u["We have tried to resolve our problems DRDC15f"] !== true);
console.log("no CS order unchecked", u["To my knowledge there is no child support order DRDC15f"] !== true);
console.log("no spousal unchecked", u["Neither party is entitled to spousal support DRDC15f"] !== true);
console.log("no DUI unchecked", u["Neither party has been convicted DRDC15f"] !== true);
console.log("DV no unchecked", u["DV has not occurred DRDC15f"] !== true);
console.log("payer A unchecked", u["Party A OR_3 DRDC15f"] !== true);
