import type { CaseFillValues } from "./case-values";
import { commonCaptionFields } from "./case-values";

function partyA(assigned: unknown) {
  return assigned === "client" || assigned === "sell";
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
    "We do not have a covenant marriage DRDA10f": true,
    "Our marriage is broken DRDA10f": true,
    "Conciliation Services would not work DRDA10f": true,
    "This is the proper court DRDA10f": true,
    "I have lived in AZ for 90 days DRDA10f": true,
    "Dissolve our marriage DRDA10f": true,
    "Make fair division DRDA10f": true,
  };

  if (v.hasCommunityProperty === false || (!v.hasRealEstate && !v.hasVehicles && !v.hasHousehold && !v.hasRetirement)) {
    out["No community property DRDA10f"] = true;
  } else {
    out["Did acquire community property DRDA10f"] = true;
  }

  if (v.hasRealEstate && v.realEstate[0]) {
    const r = v.realEstate[0];
    out["Real estate located DRDA10f"] = true;
    out["Real estate located at DRDA10f"] = String(r.address ?? "");
    out["Value DRDA10f"] = r.estimated_value != null ? String(r.estimated_value) : "";
    if (partyA(r.assigned_to)) out["A real estate DRDA10f"] = true;
    if (partyB(r.assigned_to)) out["B real estate DRDA10f"] = true;
  }
  if (v.hasRealEstate && v.realEstate[1]) {
    const r = v.realEstate[1];
    out["Real estate 2 located at DRDA10f"] = true;
    out["Real estate located at_2 DRDA10f"] = String(r.address ?? "");
    if (partyA(r.assigned_to)) out["Party A real estate DRDA10f"] = true;
    if (partyB(r.assigned_to)) out["Party B real estate DRDA10f"] = true;
  }

  if (v.hasHousehold) {
    out["Household furniture DRDA10f"] = true;
    out["Household furnishings DRDA10f"] = true;
    v.household.slice(0, 6).forEach((item, i) => {
      const n = i + 1;
      out[`${n} DRDA10f`] = String(item.description ?? "");
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
      if (partyA(v0.assigned_to)) out["A motor vehicles 1 DRDA10f"] = true;
      if (partyB(v0.assigned_to)) out["B motor vehicles 1 DRDA10f"] = true;
    }
    const v1 = v.vehicles[1];
    if (v1) {
      out["Make_2 DRDA10f"] = String(v1.make ?? "");
      out["Year_2 DRDA10f"] = v1.year != null ? String(v1.year) : "";
      out["Model_2 DRDA10f"] = String(v1.model ?? "");
      if (partyA(v1.assigned_to)) out["A motor vehicles 2 DRDA10f"] = true;
      if (partyB(v1.assigned_to)) out["B motor vehicles 2 DRDA10f"] = true;
    }
  }

  if (v.hasRetirement) {
    out["Pension retirement DRDA10f"] = true;
  }

  if (!v.hasSeparateProperty) {
    out["I do not have property DRDA10f"] = true;
  } else {
    out["I have property or separate property DRDA10f"] = true;
    v.separateProperty.slice(0, 3).forEach((item, i) => {
      const n = i + 1;
      out[`Description of Separate Property ${n} DRDA10f`] = String(item.description ?? "");
      if (item.owner_party === "client") out[`A SP ${n} DRDA10f`] = true;
      if (item.owner_party === "spouse") out[`B SP ${n} DRDA10f`] = true;
    });
  }

  if (!v.hasCommunityDebts) {
    out["No community debts DRDA10f"] = true;
  } else {
    out["Did incur community debts DRDA10f"] = true;
    v.communityDebts.slice(0, 5).forEach((d, i) => {
      const n = i + 1;
      const label = [d.creditor, d.amount_owed != null ? `$${d.amount_owed}` : null]
        .filter(Boolean)
        .join(" — ");
      out[`Description of Debt ${n} DRDA10f`] = label;
      const clientPays = Number(d.amount_client_pays ?? 0);
      const spousePays = Number(d.amount_spouse_pays ?? 0);
      if (clientPays >= spousePays) out[`A debt ${n} DRDA10f`] = true;
      if (spousePays > clientPays) out[`B debt ${n} DRDA10f`] = true;
    });
  }

  if (!v.hasSeparateDebts) {
    out["Do not have any debt or separate debt DRDA10f"] = true;
  } else {
    out["I have debt or separate debt DRDA10f"] = true;
  }

  if (v.pregnant) {
    out["Party B IS pregnant DRDA10f"] = true;
    out["The baby is due on DRDA10f"] = v.dueDate;
    if (v.spouseIsFather) {
      out["Party A and Party B ARE the parents of the child OR DRDA10f"] = true;
    } else {
      out["Party B IS NOT the parent of the child DRDA10f"] = true;
    }
  } else {
    out["Party B IS NOT pregnant OR DRDA10f"] = true;
    out["Party A not pregnant DRDA10f"] = true;
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
    "We do not have covenant marriage DRDC15f": true,
    "Our marriage is broken DRDC15f": true,
    "We have tried to resolve our problems DRDC15f": true,
    "This Court has jurisdiction to determine DRDC15f": true,
    "This is the proper court to bring DRDC15f": true,
    "90 day requirement I have lived in AZ DRDC15f": true,
    "has not occurred during this marriage DRDC15f": !v.hasDv,
    "has or DRDC15f": v.hasDv,
    "Dissolve our marriage and return to single DRDC15f": true,
    "To my knowledge there is no child support order DRDC15f": true,
    "Does not apply DRDC15f": true,
    "Neither party is entitled to spousal support DRDC15f": true,
    "DV has not occurred DRDC15f": !v.hasDv,
    "There has been DV DRDC15f": v.hasDv,
    "Neither party has been convicted DRDC15f": true,
    "Reasonable parenting time as set forth DRDC15f": true,
  };

  if (v.children.length === 0) {
    out["There are no children DRDC15f"] = true;
  } else {
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

  if (v.pregnant) {
    out["Party B IS pregnant DRDC15f"] = true;
    out["The baby is due on DRDC15f"] = v.dueDate;
    if (v.spouseIsFather) {
      out["Party A and Party B ARE the parents of the child OR DRDC15f"] = true;
    } else {
      out["Party B IS NOT the parent of the child OR DRDC15f"] = true;
    }
  } else {
    out["Party B IS NOT pregnant OR DRDC15f"] = true;
    out["Party A is not pregnant DRDC15f"] = true;
  }

  if (
    v.hasCommunityProperty === false ||
    (!v.hasRealEstate && !v.hasVehicles && !v.hasHousehold && !v.hasRetirement)
  ) {
    out["Party A and Party B did not acquire community property DRDC15f"] = true;
  } else {
    out["Parties acquired community property DRDC15f"] = true;
  }

  if (v.hasRealEstate && v.realEstate[0]) {
    const r = v.realEstate[0];
    out["Real estate 1 DRDC15f"] = true;
    out["Real estate located at DRDC15f"] = String(r.address ?? "");
    if (partyA(r.assigned_to)) out["A real estate 1 DRDC15f"] = true;
    if (partyB(r.assigned_to)) out["B real estate 1 DRDC15f"] = true;
  }
  if (v.hasRealEstate && v.realEstate[1]) {
    const r = v.realEstate[1];
    out["Real estate 2 DRDC15f"] = true;
    out["Real estate located at_2 DRDC15f"] = String(r.address ?? "");
    if (partyA(r.assigned_to)) out["A real estate 2 DRDC15f"] = true;
    if (partyB(r.assigned_to)) out["B real estate 2 DRDC15f"] = true;
  }

  if (v.hasHousehold) {
    out["Household furniture and appliances DRDC15f"] = true;
    out["Household furnishings DRDC15f"] = true;
    v.household.slice(0, 5).forEach((item, i) => {
      const n = i + 1;
      out[`Household furniture and appliances ${n} DRDC15f`] = String(item.description ?? "");
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
      if (partyA(v0.assigned_to)) out["A20 DRDC15f"] = true;
      if (partyB(v0.assigned_to)) out["B20 DRDC15f"] = true;
    }
    const v1 = v.vehicles[1];
    if (v1) {
      out["Make_2 DRDC15f"] = String(v1.make ?? "");
      out["Year_2 DRDC15f"] = v1.year != null ? String(v1.year) : "";
      out["Model_2 DRDC15f"] = String(v1.model ?? "");
      if (partyA(v1.assigned_to)) out["A21 DRDC15f"] = true;
      if (partyB(v1.assigned_to)) out["B21 DRDC15f"] = true;
    }
  }

  if (v.hasRetirement) {
    out["Pension retirement DRDC15f"] = true;
    v.retirement.slice(0, 3).forEach((item, i) => {
      const keys = ["1_4 DRDC15f", "2_4 DRDC15f", "3_2 DRDC15f"];
      out[keys[i]] = [item.plan_type, item.approximate_value != null ? `$${item.approximate_value}` : null]
        .filter(Boolean)
        .join(" — ");
      if (item.owner_party === "client") out[`A${16 + i} DRDC15f`] = true;
      if (item.owner_party === "spouse") out[`B${16 + i} DRDC15f`] = true;
    });
  }

  if (!v.hasSeparateProperty) {
    out["Party A does not have separate property DRDC15f"] = true;
    out["Party B does not have separate property DRDC15f"] = true;
  } else {
    out["Party A has separate property DRDC15f"] = true;
    v.separateProperty.slice(0, 4).forEach((item, i) => {
      const n = i + 1;
      out[`Description of Separate Property ${n} DRDC15f`] = String(item.description ?? "");
      if (item.owner_party === "client") out[`A sep prop ${n} DRDC15f`] = true;
      if (item.owner_party === "spouse") out[`B sep prop ${n} DRDC15f`] = true;
    });
  }

  if (!v.hasCommunityDebts) {
    out["Parties did not incur community debts DRDC15f"] = true;
  } else {
    out["Parties should divide responsibility DRDC15f"] = true;
    v.communityDebts.slice(0, 6).forEach((d, i) => {
      const n = i + 1;
      out[`DESCRIPTION OF DEBT ${n} DRDC15f`] = [d.creditor, d.amount_owed != null ? `$${d.amount_owed}` : null]
        .filter(Boolean)
        .join(" — ");
      const clientPays = Number(d.amount_client_pays ?? 0);
      const spousePays = Number(d.amount_spouse_pays ?? 0);
      if (clientPays >= spousePays) out[`A debt ${n} DRDC15f`] = true;
      if (spousePays > clientPays) out[`B debt ${n} DRDC15f`] = true;
    });
  }

  if (!v.hasSeparateDebts) {
    out["Parties do not have any debts DRDC15f"] = true;
  }

  if (v.taxClaimedBy === "client" || v.taxClaimedBy === "spouse" || v.taxClaimedBy === "split") {
    out["For previous years DRDC15f"] = true;
    if (v.taxClaimedBy === "split") out["Parties will file joint federal DRDC15f"] = true;
    else out["Parties will file separate DRDC15f"] = true;
  }

  if (v.restoreName) {
    out["First name DRDC15f"] = v.clientFirst;
    out["Middle name DRDC15f"] = v.clientMiddle;
    out["Last name DRDC15f"] = v.clientLast;
    out["Restore first name DRDC15f"] = v.restoredFirst || v.clientFirst;
    out["Restore middle name DRDC15f"] = v.restoredMiddle;
    out["Restore last name DRDC15f"] = v.restoredLast || v.clientLast;
    out["Party A or_2 DRDC15f"] = true;
  }

  if (v.parenting.isJointDecision) {
    out["4 JOINT DRCVG11f"] = true;
  }

  return out;
}

export function affidavitMinorChildrenFields(v: CaseFillValues): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {
    ...commonCaptionFields(v),
    "I do not have information about a legal decision making custody court case DRCVG13f": true,
    "I have not been a partywitness in court in this state or in any other state that involved DRCVG13f":
      true,
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
    out[fromKeys[i]] = ch.lengthAtAddress.includes("–")
      ? ch.lengthAtAddress.split("–")[0].trim()
      : "";
    out[toKeys[i]] = ch.lengthAtAddress.includes("–")
      ? ch.lengthAtAddress.split("–")[1].trim()
      : "present";
    out[livedKeys[i]] = livedWithLabel(ch.livedWith);
    out[relKeys[i]] = "Parent";
  });

  return out;
}

export function parentingPlanFields(v: CaseFillValues): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {
    ...commonCaptionFields(v),
    "Domestic Violence has not occurred between the parties OR DRCVG11f": !v.hasDv,
    "Domestic Violence has occurred between the parties but one of the following applies 1 it DRCVG11f":
      v.hasDv,
    "Neither party has been convicted of driving under the influence or a drug offense within the DRCVG11f":
      true,
  };

  if (v.parenting.isJointDecision || (!v.parenting.isSoleDecision && !v.parenting.isJointDecision)) {
    out["JOINT LEGAL DECISIONMAKING DRCVG11f"] = true;
    out["3 JOINT LEGAL DECISIONMAKING BY AGREEMENT The parents agree to joint DRCVG11f"] = true;
    out["4 JOINT DRCVG11f"] = true;
  } else {
    out["SOLE LEGAL DECISIONMAKING DRCVG11f"] = true;
    out["1 SOLE LEGAL DECISIONMAKING BY AGREEMENT DRCVG11f"] = true;
    out["Party A DRCVG11f"] = true;
  }

  const childNameFields = [
    "1 DRCVG11f",
    "2 DRCVG11f",
    "3 DRCVG11f",
    "children 1 DRCVG11f",
    "children 2 DRCVG11f",
    "children 3 DRCVG11f",
    "children 4 DRCVG11f",
    "children 5 DRCVG11f",
  ];
  v.children.slice(0, 5).forEach((ch, i) => {
    if (i < 3) out[childNameFields[i]] = ch.fullName;
    out[childNameFields[i + 3]] = ch.fullName;
  });

  const schedule = v.parenting.parentingTimeSchedule || v.parenting.notes;
  if (schedule) {
    out["1_2 DRCVG11f"] = schedule;
    out["The minor children will be in the care of Party A as follows Explain DRCVG11f"] = true;
    out["1_3 DRCVG11f"] = schedule;
    out["The minor children will be in the care of Party B as follows Explain DRCVG11f"] = true;
  }

  return out;
}

export function sensitiveDataCoverSheetWcFields(
  v: CaseFillValues
): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {
    ...commonCaptionFields(v),
    "Pet Social DRSDS10f-c1 DRSDS10f-c": v.clientSsnLast4 ? `XXX-XX-${v.clientSsnLast4}` : "",
    "Respondent SSN DRSDS10f-c": v.spouseSsnLast4 ? `XXX-XX-${v.spouseSsnLast4}` : "",
    "1_2 Emp Add DRSDS10f-c": v.clientEmployer,
    "Employer City State Zip Code 1DRSDS10f-c": v.clientEmployerAddress,
    "2_2 DRSDS10f-c": v.spouseEmployer,
    "Employer City State Zip Code 2 DRSDS10f-c": v.spouseEmployerAddress,
    "Legal Decisionmaking n Order DRSDS10f-c": true,
  };

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
  v.children.slice(0, 3).forEach((ch, i) => {
    out[nameKeys[i]] = ch.fullName;
    out[dobKeys[i]] = ch.dob;
    out[ssnKeys[i]] = ch.ssnLast4 ? `XXX-XX-${ch.ssnLast4}` : "";
  });

  return out;
}

export function fieldsForTemplate(
  templateId: string,
  values: CaseFillValues
): Record<string, string | boolean> {
  switch (templateId) {
    case "woc-filing-petition":
      return petitionDrda10Fields(values);
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
    default:
      return commonCaptionFields(values);
  }
}
