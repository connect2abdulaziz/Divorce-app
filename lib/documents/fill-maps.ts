import type { CaseFillValues } from "./case-values";
import { commonCaptionFields } from "./case-values";
import { hasListedCommunityAssets } from "./validate-packet";

function partyA(assigned: unknown) {
  return assigned === "client";
}
function partyB(assigned: unknown) {
  return assigned === "spouse";
}

function livedWithLabel(value: string) {
  if (value === "client") return "Petitioner / Party A";
  if (value === "spouse") return "Respondent / Party B";
  if (value === "both") return "Both parents";
  if (value === "other") return "Other";
  return value;
}

function supportPayerIsClient(v: CaseFillValues): boolean | null {
  if (v.childSupportPayer === "client") return true;
  if (v.childSupportPayer === "spouse") return false;
  return null;
}

function currentTaxYear(): number {
  return new Date().getFullYear();
}

/** Deed legal description when the case actually has one. */
function realEstateLegal(item: Record<string, unknown>): string {
  return String(item.legal_description ?? "").trim() || String(item.notes ?? "").trim();
}

/** Dollar column on the petition. The form already prints "$" beside the box. */
function dollar(value: unknown): string {
  if (value == null || value === "") return "";
  const n = Number(value);
  return Number.isFinite(n) ? String(n) : String(value);
}

/**
 * Parenting-plan explain boxes are two single-line fields stacked vertically.
 * A long description continues on the lower row instead of clipping on the first.
 */
function splitStackedRows(text: string, maxChars = 72): [string, string] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return ["", ""];
  if (clean.length <= maxChars) return [clean, ""];
  let cut = clean.lastIndexOf(" ", maxChars);
  if (cut < 40) cut = maxChars;
  return [clean.slice(0, cut).trim(), clean.slice(cut).trim()];
}

function assignStackedRows(
  out: Record<string, string | boolean>,
  topKey: string,
  bottomKey: string,
  text: string
) {
  const [top, bottom] = splitStackedRows(text);
  if (top) out[topKey] = top;
  if (bottom) out[bottomKey] = bottom;
}

/** Even Party A, Even Party B, Odd Party A, Odd Party B — top holiday to bottom. */
const HOLIDAY_ROWS: Array<[string, string, string, string]> = [
  ["Party A_2 DRCVG11f", "Party B_2 DRCVG11f", "Party A_17 DRCVG11f", "Party B_17 DRCVG11f"],
  ["Party A_3 DRCVG11f", "Party B_3 DRCVG11f", "Party A_18 DRCVG11f", "Party B_18 DRCVG11f"],
  ["Party A_4 DRCVG11f", "Party B_4 DRCVG11f", "Party A_19 DRCVG11f", "Party B_19 DRCVG11f"],
  ["Party A_5 DRCVG11f", "Party B_5 DRCVG11f", "Party A_20 DRCVG11f", "Party B_20 DRCVG11f"],
  ["Party A_6 DRCVG11f", "Party B_6 DRCVG11f", "Party A_21 DRCVG11f", "Party B_21 DRCVG11f"],
  ["Party A_7 DRCVG11f", "Party B_7 DRCVG11f", "Party A_22 DRCVG11f", "Party B_22 DRCVG11f"],
  ["Party A_8 DRCVG11f", "Party B_8 DRCVG11f", "Party A_23 DRCVG11f", "Party B_23 DRCVG11f"],
  ["Party A_9 DRCVG11f", "Party B_9 DRCVG11f", "Party A_24 DRCVG11f", "Party B_24 DRCVG11f"],
  ["Party A_10 DRCVG11f", "Party B_10 DRCVG11f", "Party A_25 DRCVG11f", "Party B_25 DRCVG11f"],
  ["Party A_11 DRCVG11f", "Party B_11 DRCVG11f", "Party A_26 DRCVG11f", "Party B_26 DRCVG11f"],
  ["Party A_12 DRCVG11f", "Party B_12 DRCVG11f", "Party A_27 DRCVG11f", "Party B_27 DRCVG11f"],
  ["Party A_13 DRCVG11f", "Party B_13 DRCVG11f", "Party A_28 DRCVG11f", "Party B_28 DRCVG11f"],
  ["Party A_14 DRCVG11f", "Party B_14 DRCVG11f", "Party A_29 DRCVG11f", "Party B_29 DRCVG11f"],
  ["Party A_15 DRCVG11f", "Party B_15 DRCVG11f", "Party A_30 DRCVG11f", "Party B_30 DRCVG11f"],
  ["Party A_16 DRCVG11f", "Party B_16 DRCVG11f", "Party A_31 DRCVG11f", "Party B_31 DRCVG11f"],
];

const MOTHERS_DAY_ROW = 13;
const FATHERS_DAY_ROW = 14;

function motherIsPartyA(v: CaseFillValues): boolean | null {
  if (v.clientGender === "female") return true;
  if (v.clientGender === "male") return false;
  if (v.spouseGender === "female") return false;
  if (v.spouseGender === "male") return true;
  return null;
}

function assignHolidayGrid(out: Record<string, string | boolean>, v: CaseFillValues) {
  const motherA = motherIsPartyA(v);
  HOLIDAY_ROWS.forEach(([evenA, evenB, oddA, oddB], i) => {
    let evenIsA = i % 2 === 0;
    if (motherA !== null && i === MOTHERS_DAY_ROW) evenIsA = motherA;
    if (motherA !== null && i === FATHERS_DAY_ROW) evenIsA = !motherA;
    const sameBothYears = motherA !== null && (i === MOTHERS_DAY_ROW || i === FATHERS_DAY_ROW);
    out[evenA] = evenIsA;
    out[evenB] = !evenIsA;
    out[oddA] = sameBothYears ? evenIsA : !evenIsA;
    out[oddB] = sameBothYears ? !evenIsA : evenIsA;
  });
}

/** Extra fields for Petition DRDA10FZ (without children) beyond the common caption. */
export function petitionDrda10Fields(v: CaseFillValues): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {
    ...commonCaptionFields(v),
    "Name DRDA10f": v.clientName,
    "Address DRDA10f": [v.clientAddress, v.clientCsz].filter(Boolean).join(", "),
    "Date of Birth DRDA10f": v.clientDob,
    "Job Title DRDA10f": v.clientJobTitle || (v.clientEmployed ? v.clientEmployer : "Not employed"),
    "Starting with today number of monthsyears in a row you have lived in Arizona DRDA10f":
      v.clientAzResidency,
    "Name_2 DRDA10f": v.spouseName,
    "Address_2 DRDA10f": [v.spouseAddress, v.spouseCsz].filter(Boolean).join(", "),
    "Date of Birth_2 DRDA10f": v.spouseDob,
    "Job Title_2 DRDA10f":
      v.spouseJobTitle || (v.spouseEmployed ? v.spouseEmployer : "Unknown / not employed"),
    "Starting with today number of monthsyears in a row your spouse has lived in Arizona DRDA10f":
      v.spouseAzResidency,
    "INFORMATION ABOUT MY MARRIAGE DRDA10f": v.marriageDate,
    "City and state or country where we were married DRDA10f": v.marriagePlace,
    "Our marriage is broken DRDA10f": true,
    "This is the proper court DRDA10f": true,
    "I have lived in AZ for 90 days DRDA10f": true,
    "Dissolve our marriage DRDA10f": true,
    "Make fair division DRDA10f": true,
  };

  if (v.isCovenantMarriage === false) {
    out["We do not have a covenant marriage DRDA10f"] = true;
  }
  if (v.conciliationAttempted === true) {
    out["Conciliation Services would not work DRDA10f"] = true;
  }

  if (v.spousalMaintenanceRequested === false) {
    out["Neither party entitled to spousal support DRDA10f"] = true;
  } else if (v.spousalMaintenanceRequested === true) {
    out["Party A or B entitled to spousal support DRDA10f"] = true;
    if (v.spousalMaintenanceFor === "client") out["Party A spousal support DRDA10f"] = true;
    if (v.spousalMaintenanceFor === "spouse") out["Party B_12 DRDA10f"] = true;
    out["Order spousal support to DRDA10f"] = true;
    out["Order spousal maintenancesupport to be paid by DRDA10f"] = true;
    // Party A_12 is the "paid by Party A" payer checkbox when Party B is the recipient.
    if (v.spousalMaintenanceFor === "spouse") out["Party A_12 DRDA10f"] = true;
  }

  if (hasListedCommunityAssets(v)) {
    out["Did acquire community property DRDA10f"] = true;
  } else {
    out["No community property DRDA10f"] = true;
  }

  if (v.hasRealEstate && v.realEstate[0]) {
    const r = v.realEstate[0];
    const address = String(r.address ?? "").trim();
    out["Real estate located DRDA10f"] = true;
    // Street / full address on the location line; overflow continues on legal lines.
    out["Real estate located at DRDA10f"] = address;
    out["Value DRDA10f"] = dollar(r.estimated_value);
    const mortgage = dollar(r.amount_owed);
    if (mortgage) out["undefined_5 DRDA10f"] = mortgage;
    const legalLines: string[] = [];
    if (r.assigned_to === "sell") {
      legalLines.push("Sell property and divide proceeds 50/50");
      out["A real estate DRDA10f"] = true;
      out["B real estate DRDA10f"] = true;
    } else {
      if (partyA(r.assigned_to)) out["A real estate DRDA10f"] = true;
      if (partyB(r.assigned_to)) out["B real estate DRDA10f"] = true;
    }
    const legal = realEstateLegal(r);
    if (legal) legalLines.push(legal);
    else if (address.length > 40) legalLines.push(address);
    if (legalLines[0]) out["Legal Description 1 DRDA10f"] = legalLines[0];
    if (legalLines[1]) out["Legal Description 2 DRDA10f"] = legalLines[1];
  }
  if (v.hasRealEstate && v.realEstate[1]) {
    const r = v.realEstate[1];
    const address = String(r.address ?? "").trim();
    out["Real estate 2 located at DRDA10f"] = true;
    out["Real estate located at_2 DRDA10f"] = address;
    const value = dollar(r.estimated_value);
    if (value) out["undefined_7 DRDA10f"] = value;
    const legalLines: string[] = [];
    if (r.assigned_to === "sell") {
      legalLines.push("Sell property and divide proceeds 50/50");
      out["Party A real estate DRDA10f"] = true;
      out["Party B real estate DRDA10f"] = true;
    } else {
      if (partyA(r.assigned_to)) out["Party A real estate DRDA10f"] = true;
      if (partyB(r.assigned_to)) out["Party B real estate DRDA10f"] = true;
    }
    const mortgage = dollar(r.amount_owed);
    if (mortgage) legalLines.push(`Mortgage/lien owed: $${mortgage}`);
    const legal = realEstateLegal(r);
    if (legal) legalLines.push(legal);
    if (legalLines[0]) out["Legal Description 1_2 DRDA10f"] = legalLines[0];
    if (legalLines[1]) out["Legal Description 2_2 DRDA10f"] = legalLines[1];
    if (legalLines[2]) out["Legal Description 3 DRDA10f"] = legalLines[2];
  }

  if (v.hasHousehold) {
    out["Household furniture DRDA10f"] = true;
    out["Household furnishings DRDA10f"] = true;
    const furnitureValueKeys = [
      "undefined_40 DRDA10f",
      "undefined_41 DRDA10f",
      "undefined_42 DRDA10f",
      "undefined_43 DRDA10f",
      "undefined_44 DRDA10f",
      "undefined_45 DRDA10f",
    ];
    v.household.slice(0, 6).forEach((item, i) => {
      const n = i + 1;
      out[`${n} DRDA10f`] = String(item.description ?? "");
      const value = dollar(item.estimated_value);
      if (value) out[furnitureValueKeys[i]] = value;
      if (partyA(item.assigned_to)) out[`A furniture ${n} DRDA10f`] = true;
      if (partyB(item.assigned_to)) out[`B furniture ${n} DRDA10f`] = true;
    });
  }

  if (v.hasVehicles) {
    out["Motor vehicles DRDA10f"] = true;
    const v0 = v.vehicles[0];
    if (v0) {
      out["Make DRDA10f"] = String(v0.make ?? "");
      out["Year DRDA10f"] = v0.year != null ? String(v0.year) : "";
      out["Model DRDA10f"] = String(v0.model ?? "");
      out["VIN DRDA10f"] = String(v0.vin ?? "");
      out["Lien Holder DRDA10f"] = String(v0.lienholder ?? "");
      const value0 = dollar(v0.estimated_value);
      if (value0) out["undefined_59 DRDA10f"] = value0;
      if (partyA(v0.assigned_to)) out["A motor vehicles 1 DRDA10f"] = true;
      if (partyB(v0.assigned_to)) out["B motor vehicles 1 DRDA10f"] = true;
    }
    const v1 = v.vehicles[1];
    if (v1) {
      out["Make_2 DRDA10f"] = String(v1.make ?? "");
      out["Year_2 DRDA10f"] = v1.year != null ? String(v1.year) : "";
      out["Model_2 DRDA10f"] = String(v1.model ?? "");
      out["VIN_2 DRDA10f"] = String(v1.vin ?? "");
      out["Lien Holder_2 DRDA10f"] = String(v1.lienholder ?? "");
      const value1 = dollar(v1.estimated_value);
      if (value1) out["undefined_60 DRDA10f"] = value1;
      if (partyA(v1.assigned_to)) out["A motor vehicles 2 DRDA10f"] = true;
      if (partyB(v1.assigned_to)) out["B motor vehicles 2 DRDA10f"] = true;
    }
  }

  if (v.hasRetirement) {
    out["Pension retirement DRDA10f"] = true;
    const descKeys = ["1_4 DRDA10f", "2_4 DRDA10f", "3_4 DRDA10f"];
    const valueKeys = ["undefined_55 DRDA10f", "undefined_56 DRDA10f", "undefined_57 DRDA10f"];
    v.retirement.slice(0, 3).forEach((item, i) => {
      const n = i + 1;
      const plan = String(item.plan_type ?? "").trim();
      const division = String(item.division_method ?? "").trim();
      out[descKeys[i]] = division ? `${plan} — ${division}` : plan;
      const value = dollar(item.approximate_value);
      if (value) out[valueKeys[i]] = value;
      const equalSplit = /50|equal|divid/i.test(division);
      if (equalSplit) {
        out[`A pension ${n} DRDA10f`] = true;
        out[`B pension ${n} DRDA10f`] = true;
      } else if (item.owner_party === "spouse") {
        out[`B pension ${n} DRDA10f`] = true;
      } else {
        out[`A pension ${n} DRDA10f`] = true;
      }
    });
  }

  if (!v.hasSeparateProperty) {
    out["I do not have property DRDA10f"] = true;
    out["Party B does not have any property DRDA10f"] = true;
  } else {
    const clientHas = v.separateProperty.some((item) => item.owner_party === "client");
    const spouseHas = v.separateProperty.some((item) => item.owner_party === "spouse");
    if (clientHas) out["I have property or separate property DRDA10f"] = true;
    else out["I do not have property DRDA10f"] = true;
    if (spouseHas) out["Party B has property or separate property DRDA10f"] = true;
    else out["Party B does not have any property DRDA10f"] = true;
    const separateValueKeys = [
      "undefined_64 DRDA10f",
      "undefined_67 DRDA10f",
      "undefined_70 DRDA10f",
    ];
    v.separateProperty.slice(0, 3).forEach((item, i) => {
      const n = i + 1;
      out[`Description of Separate Property ${n} DRDA10f`] = String(item.description ?? "");
      const value = dollar(item.estimated_value);
      if (value) out[separateValueKeys[i]] = value;
      if (item.owner_party === "client") out[`A SP ${n} DRDA10f`] = true;
      if (item.owner_party === "spouse") out[`B SP ${n} DRDA10f`] = true;
    });
  }

  if (!(v.hasCommunityDebts === true && v.communityDebts.length > 0)) {
    out["No community debts DRDA10f"] = true;
  } else {
    out["Did incur community debts DRDA10f"] = true;
    out["Order each party to pay community debts DRDA10f"] = true;
    const debtAmountKeys = [
      "undefined_72 DRDA10f",
      "undefined_75 DRDA10f",
      "undefined_78 DRDA10f",
      "undefined_81 DRDA10f",
      "undefined_84 DRDA10f",
    ];
    v.communityDebts.slice(0, 5).forEach((d, i) => {
      const n = i + 1;
      const clientPays = Number(d.amount_client_pays ?? 0);
      const spousePays = Number(d.amount_spouse_pays ?? 0);
      const creditor = String(d.creditor ?? "").trim();
      const allocation =
        clientPays > 0 || spousePays > 0
          ? ` (Party A pays $${clientPays || 0}; Party B pays $${spousePays || 0})`
          : "";
      out[`Description of Debt ${n} DRDA10f`] = `${creditor}${allocation}`;
      const amount = dollar(d.amount_owed);
      if (amount) out[debtAmountKeys[i]] = amount;
      // Check every party who is assigned a payment share.
      if (clientPays > 0 || (clientPays === 0 && spousePays === 0)) {
        out[`A debt ${n} DRDA10f`] = true;
      }
      if (spousePays > 0) out[`B debt ${n} DRDA10f`] = true;
    });
  }

  if (!v.hasSeparateDebts) {
    out["Do not have any debt or separate debt DRDA10f"] = true;
  } else {
    out["I have debt or separate debt DRDA10f"] = true;
  }

  // Tax returns (going forward + previous years).
  if (v.taxGoingForwardFiling === "separate") {
    out["File separate federal and state tax returns DRDA10f"] = true;
  }
  if (v.taxPreviousYearsFiling === "joint" || v.taxPreviousYearsFiling === "separate") {
    out["For previous years DRDA10f"] = true;
    if (v.taxPreviousYearsFiling === "joint") {
      out["The parties will file joint federal and state income tax returns For previousDRDA10f"] =
        true;
    } else {
      out["The parties will file separate federal and state income tax returns For previous DRDA10f"] =
        true;
    }
  }

  // Pregnancy: map to the wife's party (A = petitioner, B = spouse).
  const wifeIsPartyA = v.clientGender === "female";
  const wifeIsPartyB = v.spouseGender === "female" || (!wifeIsPartyA && v.clientGender !== "female");
  if (v.pregnant) {
    if (wifeIsPartyA) out["Party A is pregnant DRDA10f"] = true;
    else out["Party B IS pregnant DRDA10f"] = true;
    out["The baby is due on DRDA10f"] = v.dueDate;
    if (v.spouseIsFather) {
      out["Party A and Party B ARE the parents of the child OR DRDA10f"] = true;
    } else if (wifeIsPartyB) {
      out["Party B IS NOT the parent of the child DRDA10f"] = true;
    } else {
      out["Party A or DRDA10f"] = true;
    }
  } else if (v.pregnancyAnswered) {
    // Mark the wife not pregnant; also mark the other party when they are not the wife.
    if (wifeIsPartyA) out["Party A not pregnant DRDA10f"] = true;
    if (wifeIsPartyB) out["Party B IS NOT pregnant OR DRDA10f"] = true;
    if (!wifeIsPartyA && v.clientGender !== "female") out["Party A not pregnant DRDA10f"] = true;
  }

  if (v.hasWrittenAgreement === true) {
    out["Party A and B have a written agreement DRDA10f"] = true;
  } else if (v.hasWrittenAgreement === false) {
    out["Party A and B do not have agreement DRDA10f"] = true;
  }

  if (v.restoreName) {
    out["Married name first DRDA10f"] = v.clientFirst;
    out["Married name middle DRDA10f"] = v.clientMiddle;
    out["Married name last DRDA10f"] = v.clientLast;
    out["Restore name first DRDA10f"] = v.restoredFirst || v.clientFirst;
    out["Restore name middle DRDA10f"] = v.restoredMiddle;
    out["Restore name last DRDA10f"] = v.restoredLast || v.clientLast;
  }

  return out;
}

/** Petition DRDC15FZ — with minor children. */
export function petitionDrdc15Fields(v: CaseFillValues): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {
    ...commonCaptionFields(v),
    "Name DRDC15f": v.clientName,
    "Address DRDC15f": [v.clientAddress, v.clientCsz].filter(Boolean).join(", "),
    "Date of Birth DRDC15f": v.clientDob,
    "Job Title DRDC15f": v.clientJobTitle || (v.clientEmployed ? v.clientEmployer : "Not employed"),
    "I have lived in Arizona for DRDC15f": v.clientAzYears,
    "years andor DRDC15f": v.clientAzMonths,
    "Name_2 DRDC15f": v.spouseName,
    "Address_2 DRDC15f": [v.spouseAddress, v.spouseCsz].filter(Boolean).join(", "),
    "Date of Birth_2 DRDC15f": v.spouseDob,
    "Job Title_2 DRDC15f":
      v.spouseJobTitle || (v.spouseEmployed ? v.spouseEmployer : "Unknown / not employed"),
    "My spouse has lived in Arizona for DRDC15f": v.spouseAzYears,
    "years andor_2 DRDC15f": v.spouseAzMonths,
    "Date of Marriage DRDC15f": v.marriageDate,
    "City and state or country where we were married DRDC15f": v.marriagePlace,
    "Our marriage is broken DRDC15f": true,
    "This Court has jurisdiction to determine DRDC15f": true,
    "This is the proper court to bring DRDC15f": true,
    "90 day requirement I have lived in AZ DRDC15f": true,
    "Dissolve our marriage and return to single DRDC15f": true,
    "Does not apply DRDC15f": true,
    "Reasonable parenting time as set forth DRDC15f": true,
    "Other expenses DRDC15f": true,
  };

  if (v.isCovenantMarriage === false) {
    out["We do not have covenant marriage DRDC15f"] = true;
  }
  if (v.conciliationAttempted === true) {
    out["We have tried to resolve our problems DRDC15f"] = true;
  }
  if (v.dvAnswered) {
    out["has not occurred during this marriage DRDC15f"] = !v.hasDv;
    out["has or DRDC15f"] = v.hasDv;
    out["DV has not occurred DRDC15f"] = !v.hasDv;
    out["There has been DV DRDC15f"] = v.hasDv;
  }
  if (v.hasExistingChildSupportOrder === false) {
    out["To my knowledge there is no child support order DRDC15f"] = true;
  } else if (v.hasExistingChildSupportOrder === true) {
    out["There is an order for child support DRDC15f"] = true;
  }
  if (v.spousalMaintenanceRequested === false) {
    out["Neither party is entitled to spousal support DRDC15f"] = true;
    out["Do not order spousal maintenance DRDC15f"] = true;
  } else if (v.spousalMaintenanceRequested === true) {
    if (v.spousalMaintenanceFor === "client") {
      out["Party A is entitled to spousal support DRDC15f"] = true;
    } else if (v.spousalMaintenanceFor === "spouse") {
      out["Party B is entitled to spousal support DRDC15f"] = true;
    }
    out["Order spousal support to be paid by DRDC15f"] = true;
  }
  if (v.hasDuiOrDrugConviction === false) {
    out["Neither party has been convicted DRDC15f"] = true;
  } else if (v.hasDuiOrDrugConviction === true) {
    out["One or both parties have been convicted DRDC15f"] = true;
  }

  // With-children track must never claim there are no children.
  if (!v.hasCommonChildren && v.children.length === 0) {
    out["There are no children DRDC15f"] = true;
  } else if (v.children.length > 0) {
    const childNameKeys = [
      "Childs Name DRDC15f",
      "Childs Name_2 DRDC15f",
      "Childs Name_3 DRDC15f",
      "Childs Name_4 DRDC15f",
      "Childs Name_5 DRDC15f",
    ];
    const birthKeys = [
      "Birthdate DRDC15f",
      "Birthdate_2 DRDC15f",
      "Birthdate_3 DRDC15f",
      "Birthdate_4 DRDC15f",
      "Birthdate_5 DRDC15f",
    ];
    const priorKeys = [
      "Born prior to marriage DRDC15f",
      "Born prior to marriage_2 DRDC15f",
      "Born prior to marriage_3 DRDC15f",
      "Born prior to marriage_4 DRDC15f",
      "Born prior to marriage_5 DRDC15f",
    ];
    const addrKeys = [
      "Address_3 DRDC15f",
      "Address_4 DRDC15f",
      "Address_5 DRDC15f",
      "Address_6 DRDC15f",
      "Address_7 DRDC15f",
    ];
    const lengthKeys = [
      "Length of Time at Address DRDC15f",
      "Length of Time at Address_2 DRDC15f",
      "Length of Time at Address_3 DRDC15f",
      "Length of Time at Address_4 DRDC15f",
      "Length of Time at Address_5 DRDC15f",
    ];
    v.children.slice(0, 5).forEach((ch, i) => {
      out[childNameKeys[i]] = ch.fullName;
      out[birthKeys[i]] = ch.dob;
      if (ch.bornPriorToMarriage) out[priorKeys[i]] = true;
      out[addrKeys[i]] = [ch.primaryAddress, ch.primaryCsz].filter(Boolean).join(", ");
      out[lengthKeys[i]] = ch.lengthAtAddress;
    });
    out["Party As home is primary DRDC15f"] = true;
    out["children DRDC15f"] = v.children.map((c) => c.fullName).join("; ");
  }

  // Pregnancy: exactly one selection (form instructs choose one).
  if (v.pregnant) {
    out["Party B IS pregnant DRDC15f"] = true;
    out["The baby is due on DRDC15f"] = v.dueDate;
    if (v.spouseIsFather) {
      out["Party A and Party B ARE the parents of the child OR DRDC15f"] = true;
    } else {
      out["Party B IS NOT the parent of the child OR DRDC15f"] = true;
    }
  } else {
    out["Party A is not pregnant DRDC15f"] = true;
  }

  if (hasListedCommunityAssets(v)) {
    out["Parties acquired community property DRDC15f"] = true;
  } else {
    out["Party A and Party B did not acquire community property DRDC15f"] = true;
  }

  if (v.hasRealEstate && v.realEstate[0]) {
    const r = v.realEstate[0];
    out["Real estate 1 DRDC15f"] = true;
    out["Real estate located at DRDC15f"] = String(r.address ?? "");
    const value = dollar(r.estimated_value);
    if (value) out["undefined_9 DRDC15f"] = value;
    const legal = realEstateLegal(r);
    if (legal) out["1_2 DRDC15f"] = legal;
    if (partyA(r.assigned_to)) out["A real estate 1 DRDC15f"] = true;
    if (partyB(r.assigned_to)) out["B real estate 1 DRDC15f"] = true;
  }
  if (v.hasRealEstate && v.realEstate[1]) {
    const r = v.realEstate[1];
    out["Real estate 2 DRDC15f"] = true;
    out["Real estate located at_2 DRDC15f"] = String(r.address ?? "");
    const value = dollar(r.estimated_value);
    if (value) out["undefined_13 DRDC15f"] = value;
    const legal = realEstateLegal(r);
    if (legal) out["1_3 DRDC15f"] = legal;
    if (partyA(r.assigned_to)) out["A real estate 2 DRDC15f"] = true;
    if (partyB(r.assigned_to)) out["B real estate 2 DRDC15f"] = true;
  }

  if (v.hasHousehold) {
    out["Household furniture and appliances DRDC15f"] = true;
    out["Household furnishings DRDC15f"] = true;
    const furnitureValueKeys = [
      "undefined_49 DRDC15f",
      "undefined_50 DRDC15f",
      "undefined_51 DRDC15f",
      "undefined_52 DRDC15f",
      "undefined_53 DRDC15f",
    ];
    v.household.slice(0, 5).forEach((item, i) => {
      const n = i + 1;
      out[`Household furniture and appliances ${n} DRDC15f`] = String(item.description ?? "");
      const value = dollar(item.estimated_value);
      if (value) out[furnitureValueKeys[i]] = value;
      if (partyA(item.assigned_to)) out[`A${n} DRDC15f`] = true;
      if (partyB(item.assigned_to)) out[`B${n} DRDC15f`] = true;
    });
  }

  if (v.hasVehicles) {
    out["Vehicle 1 DRDC15f"] = true;
    const v0 = v.vehicles[0];
    if (v0) {
      out["Make DRDC15f"] = String(v0.make ?? "");
      out["Year DRDC15f"] = v0.year != null ? String(v0.year) : "";
      out["Model DRDC15f"] = String(v0.model ?? "");
      out["VIN DRDC15f"] = String(v0.vin ?? "");
      out["Lien Holder DRDC15f"] = String(v0.lienholder ?? "");
      const value0 = dollar(v0.estimated_value);
      if (value0) out["undefined_71 DRDC15f"] = value0;
      if (partyA(v0.assigned_to)) out["A20 DRDC15f"] = true;
      if (partyB(v0.assigned_to)) out["B20 DRDC15f"] = true;
    }
    const v1 = v.vehicles[1];
    if (v1) {
      out["Make_2 DRDC15f"] = String(v1.make ?? "");
      out["Year_2 DRDC15f"] = v1.year != null ? String(v1.year) : "";
      out["Model_2 DRDC15f"] = String(v1.model ?? "");
      out["VIN_2 DRDC15f"] = String(v1.vin ?? "");
      out["Lien Holder_2 DRDC15f"] = String(v1.lienholder ?? "");
      const value1 = dollar(v1.estimated_value);
      if (value1) out["undefined_72 DRDC15f"] = value1;
      if (partyA(v1.assigned_to)) out["A21 DRDC15f"] = true;
      if (partyB(v1.assigned_to)) out["B21 DRDC15f"] = true;
    }
  }

  if (v.hasRetirement) {
    out["Pension retirement DRDC15f"] = true;
    const descKeys = ["1_4 DRDC15f", "2_4 DRDC15f", "3_2 DRDC15f"];
    const valueKeys = ["undefined_64 DRDC15f", "undefined_65 DRDC15f", "undefined_66 DRDC15f"];
    v.retirement.slice(0, 3).forEach((item, i) => {
      out[descKeys[i]] = String(item.plan_type ?? "");
      out[valueKeys[i]] =
        item.approximate_value != null ? String(item.approximate_value) : "";
      if (item.owner_party === "client") out[`A${16 + i} DRDC15f`] = true;
      if (item.owner_party === "spouse") out[`B${16 + i} DRDC15f`] = true;
    });
  }

  if (!v.hasSeparateProperty) {
    out["Party A does not have separate property DRDC15f"] = true;
    out["Party B does not have separate property DRDC15f"] = true;
  } else {
    out["Party A has separate property DRDC15f"] = true;
    const separateValueKeys = [
      "undefined_74 DRDC15f",
      "undefined_77 DRDC15f",
      "undefined_80 DRDC15f",
      "undefined_83 DRDC15f",
    ];
    v.separateProperty.slice(0, 4).forEach((item, i) => {
      const n = i + 1;
      out[`Description of Separate Property ${n} DRDC15f`] = String(item.description ?? "");
      const value = dollar(item.estimated_value);
      if (value) out[separateValueKeys[i]] = value;
      if (item.owner_party === "client") out[`A sep prop ${n} DRDC15f`] = true;
      if (item.owner_party === "spouse") out[`B sep prop ${n} DRDC15f`] = true;
    });
  }

  if (!(v.hasCommunityDebts === true && v.communityDebts.length > 0)) {
    out["Parties did not incur community debts DRDC15f"] = true;
  } else {
    out["Parties should divide responsibility DRDC15f"] = true;
    const amountKeys = [
      "undefined_86 DRDC15f",
      "undefined_89 DRDC15f",
      "undefined_92 DRDC15f",
      "undefined_95 DRDC15f",
      "undefined_98 DRDC15f",
    ];
    v.communityDebts.slice(0, 6).forEach((d, i) => {
      const n = i + 1;
      out[`DESCRIPTION OF DEBT ${n} DRDC15f`] = String(d.creditor ?? "");
      if (i < amountKeys.length && d.amount_owed != null) {
        out[amountKeys[i]] = String(d.amount_owed);
      }
      const clientPays = Number(d.amount_client_pays ?? 0);
      const spousePays = Number(d.amount_spouse_pays ?? 0);
      if (clientPays >= spousePays) out[`A debt ${n} DRDC15f`] = true;
      if (spousePays > clientPays) out[`B debt ${n} DRDC15f`] = true;
    });
  }

  if (!v.hasSeparateDebts) {
    out["Parties do not have any debts DRDC15f"] = true;
  }

  // Taxes: after-decree separate returns; also cover prior years when tax info exists.
  out["After judge signs decree DRDC15f"] = true;
  out["Parties will file separate DRDC15f"] = true;
  if (v.taxClaimedBy === "client" || v.taxClaimedBy === "spouse" || v.taxClaimedBy === "split") {
    out["For previous years DRDC15f"] = true;
  }

  // "I [ ] have  [ ] have not already completed the Parenting Information Program."
  // Check exactly one. At filing, default to not yet completed.
  if (v.parentInfoCompleted === true) {
    out["I DRDC15f"] = true;
  } else {
    out["have DRDC15f"] = true;
  }

  // Legal decision-making must match Parenting Plan.
  if (v.parenting.isSoleDecision && !v.parenting.isJointDecision) {
    out["Award sole legal decision making to DRDC15f"] = true;
    out["Party A_13 DRDC15f"] = true;
  } else if (v.children.length > 0 || v.hasCommonChildren) {
    out["Award joint legal decision making authority DRDC15f"] = true;
  }
  if (v.children.length > 0 || v.hasCommonChildren) {
    out["Provisions for legal decision making and parenting time to be within DRDC15f"] = true;
  }

  // Current child support + attach worksheet/order.
  if (v.children.length > 0 || v.hasCommonChildren) {
    const payerIsClient = supportPayerIsClient(v);
    if (payerIsClient !== null) {
      out["Order that child support will be paid by DRDC15f"] = true;
      if (payerIsClient) out["Party A OR_3 DRDC15f"] = true;
      else out["Party B in a reasonable DRDC15f"] = true;
    }
    out["The Child Support Order to be attached to the Decree of Dissolution of Marriage DRDC15f"] =
      true;

    // Insurance: employed petitioner as default provider.
    out["Party A to provide DRDC15f"] = true;
    out["medical DRDC15f"] = true;
    out["dental DRDC15f"] = true;
    out["vision care insurance DRDC15f"] = true;

    // Child tax exemptions.
    const year = currentTaxYear();
    const taxNameKeys = [
      "Name of minor child 1 DRDC15f",
      "Name of minor child 2 DRDC15f",
      "Name of minor child 3 DRDC15f",
      "Name of minor child 4 DRDC15f",
      "Name of minor child 5 DRDC15f",
    ];
    const taxYearKeys = [
      "in Tax Year 1 DRDC15f",
      "in Tax Year 2 DRDC15f",
      "in Tax Year 3 DRDC15f",
      "in Tax Year 4 DRDC15f",
      "in Tax Year 5 DRDC15f",
    ];
    const partyATax = [
      "Party A_14 DRDC15f",
      "Party A_15 DRDC15f",
      "Party A_16 DRDC15f",
      "Party A_17 DRDC15f",
      "Party A_18 DRDC15f",
    ];
    const partyBTax = [
      "Party B_13 DRDC15f",
      "Party B_14 DRDC15f",
      "Party B_15 DRDC15f",
      "Party B_16 DRDC15f",
      "Party B_17 DRDC15f",
    ];
    const alternateYears =
      v.taxClaimedBy === "split" || /alternate/i.test(v.taxFrequency);
    if (alternateYears) {
      // Do not invent a every-year assignment when odd/even parent is unanswered.
      if (v.taxEvenYearClaimant === "client" || v.taxEvenYearClaimant === "spouse") {
        const evenParty = v.taxEvenYearClaimant;
        const oddParty = evenParty === "client" ? "spouse" : "client";
        const named = v.children.slice(0, 2);
        const subjects =
          v.children.length > 2
            ? ["All minor children"]
            : named.map((ch) => ch.fullName);
        const rows = [
          ...subjects.map((name) => ({ name, year: "even yrs", party: evenParty })),
          ...subjects.map((name) => ({ name, year: "odd yrs", party: oddParty })),
        ];
        rows.slice(0, taxNameKeys.length).forEach((row, i) => {
          out[taxNameKeys[i]] = row.name;
          out[taxYearKeys[i]] = row.year;
          if (row.party === "spouse") out[partyBTax[i]] = true;
          else out[partyATax[i]] = true;
        });
      }
    } else if (v.taxClaimedBy === "client" || v.taxClaimedBy === "spouse") {
      v.children.slice(0, 5).forEach((ch, i) => {
        out[taxNameKeys[i]] = ch.fullName;
        out[taxYearKeys[i]] = String(year);
        if (v.taxClaimedBy === "spouse") out[partyBTax[i]] = true;
        else out[partyATax[i]] = true;
      });
      out["Pattern shall repeat for subsequent years DRDC15f"] = true;
    }
  }

  // Debt cutoff uses the separation date. The date blank is misnamed as the service date.
  if (v.separationDate) {
    out["Hold harmless from debts since parties separation DRDC15f"] = true;
    out["the date my spouse was served with the Petition for Dissolution DRDC15f"] = v.separationDate;
  }

  const clientHasSeparate = v.separateProperty.some((item) => item.owner_party === "client");
  const spouseHasSeparate = v.separateProperty.some((item) => item.owner_party === "spouse");
  if (clientHasSeparate) out["Award As separate property to A DRDC15f"] = true;
  if (spouseHasSeparate) out["Award Bs separate property to B DRDC15f"] = true;

  if (v.restoreName) {
    out["First name DRDC15f"] = v.clientFirst;
    out["Middle name DRDC15f"] = v.clientMiddle;
    out["Last name DRDC15f"] = v.clientLast;
    out["Restore first name DRDC15f"] = v.restoredFirst || v.clientFirst;
    out["Restore middle name DRDC15f"] = v.restoredMiddle;
    out["Restore last name DRDC15f"] = v.restoredLast || v.clientLast;
  }

  const bornBeforeMarriage = v.children.filter((ch) => ch.bornPriorToMarriage);
  if (bornBeforeMarriage.length > 0) {
    out["A minor child or children were born before DRDC15f"] = true;
    out["Party A andor DRDC15f"] = true;
    out["Party B isare the parents of that minor childthose minor DRDC15f"] = true;
    const priorNameKeys = [
      "children named below 1 DRDC15f",
      "children named below 2 DRDC15f",
      "children named below 3 DRDC15f",
    ];
    const priorLegalKeys = [
      "Current Legal Name 1 DRDC15f",
      "Current Legal Name 2 DRDC15f",
      "Current Legal Name 3 DRDC15f",
      "Current Legal Name 4 DRDC15f",
    ];
    bornBeforeMarriage.forEach((ch, i) => {
      if (priorNameKeys[i]) out[priorNameKeys[i]] = ch.fullName;
      if (priorLegalKeys[i]) out[priorLegalKeys[i]] = ch.fullName;
    });
    out["Party A or_2 DRDC15f"] = true;
  }

  return out;
}

export function affidavitMinorChildrenFields(v: CaseFillValues): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {
    ...commonCaptionFields(v),
    "I do not have information about a legal decision making custody court case DRCVG13f": true,
    "I have not been a partywitness in court in this state or in any other state that involved DRCVG13f":
      true,
    // No third-party custody / parenting-time claim known.
    "or DRCVG13f": true,
  };

  const nameKeys = ["Name", "Name_2", "Name_3", "Name_4"];
  const birthKeys = ["Birthdate", "Birthdate_2", "Birthdate_3", "Birthdate_4"];
  const ageKeys = ["Age", "Age_2", "Age_3", "Age_4"];
  v.children.slice(0, 4).forEach((ch, i) => {
    out[nameKeys[i]] = ch.fullName;
    out[birthKeys[i]] = ch.dob;
    out[ageKeys[i]] = ch.age;
  });

  const resName = ["Childs Name", "Childs Name_2", "Childs Name_3"];
  const resAddr = ["Address", "Address_2", "Address_3"];
  const resCsz = ["City State", "City State_2", "City State_3"];
  const fromKeys = ["Dates From", "Dates From_2", "Dates From_3"];
  const toKeys = ["To", "To_2", "To_3"];
  const livedKeys = ["Lived with", "Lived with_2", "Lived with_3"];
  const relKeys = [
    "Relationship to Child",
    "Relationship to Child_2",
    "Relationship to Child_3",
  ];
  v.children.slice(0, 3).forEach((ch, i) => {
    out[resName[i]] = ch.fullName;
    out[resAddr[i]] = ch.primaryAddress;
    out[resCsz[i]] = ch.primaryCsz;
    out[fromKeys[i]] = ch.livedFrom;
    out[toKeys[i]] = ch.livedTo || "present";
    out[livedKeys[i]] = livedWithLabel(ch.livedWith);
    out[relKeys[i]] = "Parent";
  });

  return out;
}

export function parentingPlanFields(v: CaseFillValues): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {
    ...commonCaptionFields(v),
  };
  if (v.parenting.jointReviewMonths) {
    out["necessary or desired changes every"] = v.parenting.jointReviewMonths;
  }

  // Part 4 is the joint legal decision-making agreement. Those statements
  // apply only when both parents agree to joint custody.
  if (v.parenting.jointByAgreement === true) {
    if (v.dvAnswered) {
      out["Domestic Violence has not occurred between the parties OR DRCVG11f"] = !v.hasDv;
      out["Domestic Violence has occurred between the parties but one of the following applies 1 it DRCVG11f"] =
        v.hasDv;
    }
    if (v.hasDuiOrDrugConviction === false) {
      out["Neither party has been convicted of driving under the influence or a drug offense within the DRCVG11f"] =
        true;
    } else if (v.hasDuiOrDrugConviction === true) {
      out["One of the parties HAS been convicted of driving under the influence or a drug offense DRCVG11f"] =
        true;
    }
  }

  if (v.parenting.isSoleDecision && !v.parenting.isJointDecision) {
    out["SOLE LEGAL DECISIONMAKING DRCVG11f"] = true;
    out["1 SOLE LEGAL DECISIONMAKING BY AGREEMENT DRCVG11f"] = true;
    out["Party A DRCVG11f"] = true;
  } else {
    out["JOINT LEGAL DECISIONMAKING DRCVG11f"] = true;
    // Exactly one: by agreement (3) OR requested by one parent (4).
    if (v.parenting.jointByAgreement === true) {
      out["3 JOINT LEGAL DECISIONMAKING BY AGREEMENT The parents agree to joint DRCVG11f"] = true;
    } else {
      out["4 JOINT DRCVG11f"] = true;
    }
  }

  // Two columns, read left to right. "1"/"2"/"3" are the right-hand lines.
  const childNameFields = [
    "Use additional paper if necessary 1 DRCVG11f",
    "1 DRCVG11f",
    "Use additional paper if necessary 2 DRCVG11f",
    "2 DRCVG11f",
    "3 DRCVG11f",
  ];
  v.children.slice(0, childNameFields.length).forEach((ch, i) => {
    out[childNameFields[i]] = ch.fullName;
  });

  const partyASchedule = v.parenting.schedulePartyA;
  const partyBSchedule = v.parenting.schedulePartyB;
  if (partyASchedule) {
    assignStackedRows(out, "1_2 DRCVG11f", "2_2 DRCVG11f", partyASchedule);
    out["The minor children will be in the care of Party A as follows Explain DRCVG11f"] = true;
  }
  if (partyBSchedule) {
    assignStackedRows(out, "1_3 DRCVG11f", "2_3 DRCVG11f", partyBSchedule);
    out["The minor children will be in the care of Party B as follows Explain DRCVG11f"] = true;
  }
  if (v.parenting.scheduleExchangeNotes) {
    out["Other parenting time arrangements are as follows Explain DRCVG11f"] = true;
    assignStackedRows(out, "1_4 DRCVG11f", "2_4 DRCVG11f", v.parenting.scheduleExchangeNotes);
  }

  // Transportation only when the intake chose a provider — no silent Party A/B default.
  const transport = v.parenting.transportationProvider;
  if (transport) {
    out["Transportation will be provided as follows DRCVG11f"] = true;
    if (transport === "client") {
      out["Party A or DRCVG11f"] = true;
      out["Party A or_2 DRCVG11f"] = true;
    } else if (transport === "spouse") {
      out["Party B will pick the minor children up at DRCVG11f"] = true;
      out["Party B will drop the minor children off at DRCVG11f"] = true;
    } else if (transport === "shared") {
      out["Party A or DRCVG11f"] = true;
      out["Party B will drop the minor children off at DRCVG11f"] = true;
    }
    if (v.parenting.pickupTime) out["oclock DRCVG11f"] = v.parenting.pickupTime;
    if (v.parenting.dropoffTime || v.parenting.pickupTime) {
      out["oclock_2 DRCVG11f"] = v.parenting.dropoffTime || v.parenting.pickupTime;
    }
    if (v.parenting.exchangeLocation) {
      out["Parentingtime exchanges will occur at the following exchange location 1 DRCVG11f"] =
        v.parenting.exchangeLocation;
    }
  }
  if (v.parenting.advanceNoticeDays) {
    out["Parents may change their timeshare arrangements by mutual agreement with at least DRCVG11f"] =
      v.parenting.advanceNoticeDays;
  }

  // Summer / school breaks — only from explicit intake answers.
  if (v.parenting.summerScheduleSame === true) {
    out["During summer months or school breaks that last longer than 4 days no changes shall be DRCVG11f"] =
      true;
  } else if (v.parenting.summerScheduleSame === false) {
    out["During summer months or school breaks that last longer than 4 days the minor children will DRCVG11f"] =
      true;
    if (v.parenting.summerScheduleNotes) {
      out["be in the care of Party A Explain DRCVG11f"] = v.parenting.summerScheduleNotes;
    }
  }
  if (v.parenting.vacationWeeks) {
    out["Each parent is entitled to a DRCVG11f"] = true;
    out["children The parents will work out the details of the vacation at least DRCVG11f"] =
      v.parenting.vacationWeeks;
  }
  if (v.parenting.vacationNoticeDays) {
    out["undefined_2 DRCVG11f"] = v.parenting.vacationNoticeDays;
  }

  // Holiday grid: alternate even/odd years. Mother's Day and Father's Day stay
  // with that parent in both years when gender is known.
  assignHolidayGrid(out, v);
  const holidayNotes = v.parenting.notes || "";
  if (/holiday/i.test(holidayNotes)) {
    out["other holidays DRCVG11f"] = true;
    out["Other Holidays Describe the other holidays and the arrangement DRCVG11f"] = holidayNotes;
  }

  // Medical / religious (joint-friendly defaults for decision-making type only).
  if (v.parenting.isJointDecision || !v.parenting.isSoleDecision) {
    out["Both parents will make major medical decisions together except for emergency situations DRCVG11f"] =
      true;
    out["Both parents have the right to authorize emergency medical treatment if needed and the DRCVG11f"] =
      true;
  } else {
    out["Major medicaldental decisions will be made by DRCVG11f"] = true;
    out["Party A_32 DRCVG11f"] = true;
  }

  if (v.parenting.addressChangeNoticeDays) {
    out["NOTIFY OTHER PARENT OF ADDRESS CHANGE Each parent will inform the other DRCVG11f"] = true;
    out["parent of any change of address andor phone number in advance OR within DRCVG11f"] =
      v.parenting.addressChangeNoticeDays;
  }
  if (v.parenting.communicationMethod) {
    const method = v.parenting.communicationMethod;
    out["METHOD OF COMMUNICATION Each parent agrees to use the following means of DRCVG11f"] = true;
    out["communication DRCVG11f"] = method;
    out["Phone DRCVG11f"] = /phone/i.test(method);
    out["Email DRCVG11f"] = /email|e-mail/i.test(method);
  }
  if (v.parenting.communicationFrequency) {
    out["FREQUENCY OF COMMUNICATION Each parent agrees to communicate regarding the DRCVG11f"] =
      true;
    out["and will be by the following methods DRCVG11f"] = v.parenting.communicationFrequency;
  }

  return out;
}

export function sensitiveDataCoverSheetWocFields(
  v: CaseFillValues
): Record<string, string | boolean> {
  // Field names on this template are poorly exported; mapping follows the
  // two-column Party A (left) / Party B (right) layout on DRSDS10f-ANNZ.
  const clientSsn = v.clientSsnLast4 ? `XXX-XX-${v.clientSsnLast4}` : "";
  const spouseSsn = v.spouseSsnLast4 ? `XXX-XX-${v.spouseSsnLast4}` : "";
  const ssnLine =
    clientSsn && spouseSsn
      ? `A: ${clientSsn}   B: ${spouseSsn}`
      : clientSsn || spouseSsn;

  const out: Record<string, string | boolean> = {
    ...commonCaptionFields(v),
    // Date of Birth
    "Date of Birth MonthDayYear 1 DRSDS10f_An": v.clientDob,
    "undefined_2 DRSDS10f_An": v.spouseDob,
    // Social Security Number (single wide field on this template)
    "Date of Birth MonthDayYear 2 DRSDS10f_An": ssnLine,
    // Mailing Address / City State Zip / Contact Phone
    "IF REQUESTING ADDRESS PROTECTION 1 DRSDS10f_An": v.clientAddress,
    "1 DRSDS10f_An": v.spouseAddress,
    "IF REQUESTING ADDRESS PROTECTION 2 DRSDS10f_An": v.clientCsz,
    "2 DRSDS10f_An": v.spouseCsz,
    "IF REQUESTING ADDRESS PROTECTION 3 DRSDS10f_An": v.clientPhone,
    "3 DRSDS10f_Ann": v.spousePhone,
    // Court text notices
    "No texts DRSDS10f_Ann": true,
    "No texts_2 DRSDS10f_Ann": true,
    // Email Address
    "contact phone number above 2 DRSDS10f_Ann": v.clientEmail,
    "2_2 DRSDS10f_Ann": v.spouseEmail,
    // Current Employer Name
    "contact phone number above 3 DRSDS10f_Ann": v.clientEmployer,
    "3_2 DRSDS10f_Ann": v.spouseEmployer,
    // Employer Address (street)
    "contact phone number above 4 DRSDS10f_Ann": v.clientEmployerStreet,
    "4 DRSDS10f_Ann": v.spouseEmployerStreet,
    // Employer City, State, Zip
    "Employer City State Zip Code DRSDS10f_Ann": v.clientEmployerCsz,
    "5 DRSDS10f_Ann": v.spouseEmployerCsz,
    // Employer Telephone
    "Employer Telephone Number 1 DRSDS10f_Ann": v.clientEmployerPhone,
    "6 DRSDS10f_Ann": v.spouseEmployerPhone,
    // Employer Fax left blank unless collected later
    "Employer Telephone Number 2 DRSDS10f_Ann": "",
    "7 DRSDS10f_Ann": "",
    // Case type: Dissolution (Divorce) only
    "Dissolution Divorce DRSDS10f_Ann": true,
    // Interpreter
    "No DRSDS10f_Ann": !v.interpreterNeeded,
    "Yes_3 DRSDS10f_Ann": v.interpreterNeeded,
  };

  if (v.clientGender === "male") out["PetitionerGenderMale DRSDS10f-A"] = true;
  if (v.clientGender === "female") out["PetitionerGenderFemale DRSDS10f-A"] = true;
  if (v.spouseGender === "male") out["RespondentGenderMale DRSDS10f-A"] = true;
  if (v.spouseGender === "female") out["RespondentGenderFemale DRSDS10f-A"] = true;

  return out;
}

export function sensitiveDataCoverSheetWcFields(
  v: CaseFillValues
): Record<string, string | boolean> {
  // Field names on this template are poorly exported; mapping is by widget
  // position on the AcroForm (Party A left column / Party B right column).
  const out: Record<string, string | boolean> = {
    ...commonCaptionFields(v),
    // Date of Birth
    "or_2 DRSDS10f-c": v.clientDob,
    "or_3 DRSDS10f-c": v.spouseDob,
    // Social Security Number (last-4 masked for confidential cover sheet)
    "Pet Social DRSDS10f-c1 DRSDS10f-c": v.clientSsnLast4 ? `XXX-XX-${v.clientSsnLast4}` : "",
    "Respondent SSN DRSDS10f-c": v.spouseSsnLast4 ? `XXX-XX-${v.spouseSsnLast4}` : "",
    // Mailing Address
    "DRSDS10f-cN 1": v.clientAddress,
    "1 Resp DRSDS10f-c": v.spouseAddress,
    // City, State, Zip
    "Warning ON 2 DRSDS10f-c": v.clientCsz,
    "2 SSn DRSDS10f-c": v.spouseCsz,
    // Contact Phone
    "undefined_3 DRSDS10f-c": v.clientPhone,
    "undefined_4 DRSDS10f-c": v.spousePhone,
    // Court electronic notice defaults
    "No texts DRSDS10f-c": true,
    "No texts_2 DRSDS10f-c": true,
    // Email Address (template mislabels left email as Emp Add)
    "1_2 Emp Add DRSDS10f-c": v.clientEmail,
    "1_3 DRSDS10f-c": v.spouseEmail,
    // Current Employer Name
    "2_2 DRSDS10f-c": v.clientEmployer,
    "2_3 DRSDS10f-c": v.spouseEmployer,
    // Employer Address (street)
    "undefined_5 DRSDS10f-c": v.clientEmployerStreet,
    "1_4 DRSDS10f-c": v.spouseEmployerStreet,
    // Employer City, State, Zip
    "Employer City State Zip Code 1DRSDS10f-c": v.clientEmployerCsz,
    "2_4 DRSDS10f-c": v.spouseEmployerCsz,
    // Employer Telephone (left field mislabeled as Employer CSZ 2)
    "Employer City State Zip Code 2 DRSDS10f-c": v.clientEmployerPhone,
    "3 Tele num DRSDS10f-c": v.spouseEmployerPhone,
    // Employer Fax left blank unless collected later
    "undefined_6 DRSDS10f-c": "",
    "undefined_7 DRSDS10f-c": "",
    "No interpreter12 DRSDS10f-c": !v.interpreterNeeded,
    "Interpreter needed yes_10 DRSDS10f-c": v.interpreterNeeded,
    // Case type: mark only Dissolution (Divorce). Legal decision-making is a
    // separate case category and must stay unchecked on a divorce filing.
    "undefined_8 DRSDS10f-c": true,
  };

  if (v.clientGender === "male") out["PetitionerGenderMale DRSDS10f-c"] = true;
  if (v.clientGender === "female") out["PetitionerGenderFemale DRSDS10f-c"] = true;
  if (v.spouseGender === "male") out["RespondentGenderMale DRSDS10f-c"] = true;
  if (v.spouseGender === "female") out["RespondentGenderFemale DRSDS10f-c"] = true;

  const nameKeys = ["Child NameRow1 DRSDS10f-c", "Child NameRow2 DRSDS10f-c", "Child NameRow3 DRSDS10f-c"];
  const dobKeys = [
    "Child Date of Birth 1 DRSDS10f-c",
    "Child Date of Birth 2#0 DRSDS10f-c",
    "Child Date of Birth  3 DRSDS10f-c",
  ];
  const ssnKeys = [
    "Child Social Security Number 1 DRSDS10f-c",
    "Child Social Security Number 2 DRSDS10f-c",
    "Child Social Security Number 3 DRSDS10f-c",
  ];
  const genderKeys = ["GenderRow1 DRSDS10f-c", "GenderRow2 DRSDS10f-c", "GenderRow3 DRSDS10f-c"];
  v.children.slice(0, 3).forEach((ch, i) => {
    out[nameKeys[i]] = ch.fullName;
    out[dobKeys[i]] = ch.dob;
    out[ssnKeys[i]] = ch.ssnLast4 ? `XXX-XX-${ch.ssnLast4}` : "";
    if (ch.gender) out[genderKeys[i]] = ch.gender === "male" ? "M" : "F";
  });

  return out;
}

export function preliminaryInjunctionFields(
  v: CaseFillValues
): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {
    ...commonCaptionFields(v),
    "Name DR14f": v.clientName,
    "Date of Birth DR14f": v.clientDob,
    "Height DR14f": v.clientHeight,
    "Weight DR14f": v.clientWeight,
    "Drivers License last 4 nos DR14f": v.clientDriverLicenseLast4,
    "Name_2 DR14f": v.spouseName,
    "Date of Birth_2 DR14f": v.spouseDob,
    "Height_2 DR14f": v.spouseHeight,
    "Weight_2 DR14f": v.spouseWeight,
    "Drivers License last 4 nos_2 DR14f": v.spouseDriverLicenseLast4,
  };
  if (v.clientGender === "male") out["Male 1 DR14f"] = true;
  if (v.clientGender === "female") out["Female 1 DR14f"] = true;
  if (v.spouseGender === "male") out["Male 2 DR14f"] = true;
  if (v.spouseGender === "female") out["Female 2 DR14f"] = true;
  return out;
}

export function childSupportWorksheetFields(
  v: CaseFillValues
): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {
    ...commonCaptionFields(v),
    "PetitionerParty A DRS12f": v.clientName,
    "RespondentParty B DRS12f": v.spouseName,
    "Total Number of Children DRS12f": String(v.children.length),
    // Gross incomes from intake are estimates until paystubs are attached.
    "ESTIMATED based on facts or knowledge of pay before promotion or of others in similar DRS12f":
      true,
  };
  if (v.clientIncome) out["A CS income DRS12f"] = v.clientIncome;
  if (v.spouseIncome) out["B CS income DRS12f"] = v.spouseIncome;
  const schedule = `${v.parenting.schedulePartyA} ${v.parenting.parentingTimeSchedule}`.toLowerCase();
  if (/equal|50\/50|week on.?week off/.test(schedule)) {
    out["Parenting Plan equal DRS12f"] = true;
  } else if (v.children.some((ch) => ch.livedWith === "spouse") && !v.children.some((ch) => ch.livedWith === "client")) {
    out["Parenting Plan Party B DRS12f"] = true;
  } else {
    out["Parenting Plan Party A DRS12f"] = true;
  }
  return out;
}

export function parentInformationProgramOrderFields(
  v: CaseFillValues
): Record<string, string | boolean> {
  return {
    ...commonCaptionFields(v),
    "Name of Petitioner  Party A": v.clientName,
    "Name of Respondent  Party B": v.spouseName,
    // Dissolution of Marriage only. Do not also mark legal decision-making.
    "CDoMr DR12f": true,
  };
}

export function fieldsForTemplate(
  templateId: string,
  values: CaseFillValues
): Record<string, string | boolean> {
  switch (templateId) {
    case "woc-filing-petition":
      return petitionDrda10Fields(values);
    case "woc-filing-coversheet":
    case "woc-consent-coversheet":
      return sensitiveDataCoverSheetWocFields(values);
    case "wc-filing-petition":
      return petitionDrdc15Fields(values);
    case "wc-filing-affidavit-children":
      return affidavitMinorChildrenFields(values);
    case "wc-filing-parenting-plan":
    case "wc-decree-parenting-plan":
    case "wc-consent-parenting-plan":
      return parentingPlanFields(values);
    case "wc-filing-coversheet":
    case "wc-consent-coversheet":
      return sensitiveDataCoverSheetWcFields(values);
    case "wc-filing-injunction":
    case "woc-filing-injunction":
      return preliminaryInjunctionFields(values);
    case "wc-filing-parent-info":
      return parentInformationProgramOrderFields(values);
    case "wc-filing-child-support-worksheet":
    case "wc-decree-child-support-worksheet":
    case "wc-consent-child-support-worksheet":
      return childSupportWorksheetFields(values);
    default:
      return commonCaptionFields(values);
  }
}
