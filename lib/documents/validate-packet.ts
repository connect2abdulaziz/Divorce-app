import type { CaseFillValues } from "./case-values";

export type PacketIssue = {
  code: string;
  message: string;
  severity: "error" | "warning";
};

function ageAtDate(dob: string, at: string): number | null {
  const birth = new Date(dob);
  const when = new Date(at);
  if (Number.isNaN(birth.getTime()) || Number.isNaN(when.getTime())) return null;
  let age = when.getFullYear() - birth.getFullYear();
  const m = when.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && when.getDate() < birth.getDate())) age -= 1;
  return age;
}

function hasListedCommunityAssets(v: CaseFillValues) {
  return (
    (v.hasRealEstate && v.realEstate.length > 0) ||
    (v.hasVehicles && v.vehicles.length > 0) ||
    (v.hasHousehold && v.household.length > 0) ||
    (v.hasRetirement && v.retirement.length > 0)
  );
}

/** Blocking + advisory checks before PDF generation. */
export function validatePacket(v: CaseFillValues): PacketIssue[] {
  const issues: PacketIssue[] = [];

  if (!v.clientName) {
    issues.push({
      code: "missing_petitioner_name",
      severity: "error",
      message: "Petitioner name is missing.",
    });
  }
  if (!v.spouseName) {
    issues.push({
      code: "missing_respondent_name",
      severity: "error",
      message: "Respondent name is missing.",
    });
  }
  if (!v.marriageDate) {
    issues.push({
      code: "missing_marriage_date",
      severity: "error",
      message: "Marriage date is missing.",
    });
  }

  if (v.hasCommonChildren) {
    if (v.children.length === 0) {
      issues.push({
        code: "children_gate_without_records",
        severity: "error",
        message:
          "This case is marked as having minor children, but no child records were entered. Add children before generating the with-children packet.",
      });
    }
    if (v.parenting.isJointDecision && v.parenting.jointByAgreement == null) {
      issues.push({
        code: "joint_agreement_unspecified",
        severity: "warning",
        message:
          "Joint legal decision-making is selected, but it is unclear whether both parents agree. The packet will use “requested by one parent” until you answer that question on the parenting step.",
      });
    }
    const schedule = v.parenting.parentingTimeSchedule || v.parenting.notes;
    if (v.parenting.visitationWanted === true && !schedule) {
      issues.push({
        code: "missing_parenting_schedule",
        severity: "warning",
        message:
          "Parenting time is requested but no schedule details were provided. Add who has which weekends, weekday times, and exchanges.",
      });
    }
  }

  if (v.hasCommunityProperty === true && !hasListedCommunityAssets(v)) {
    issues.push({
      code: "community_property_empty",
      severity: "error",
      message:
        "Community property is marked yes, but no real estate, vehicles, household items, or retirement accounts were listed. Add items or change the answer to no.",
    });
  }

  if (v.hasCommunityDebts === true && v.communityDebts.length === 0) {
    issues.push({
      code: "community_debts_empty",
      severity: "error",
      message:
        "Community debts are marked yes, but no debts were listed. Add debts or change the answer to no.",
    });
  }

  if (v.spouseDob && v.marriageDate) {
    const age = ageAtDate(v.spouseDob, v.marriageDate);
    if (age != null && age < 16) {
      issues.push({
        code: "spouse_age_at_marriage",
        severity: "error",
        message: `Respondent birthdate (${v.spouseDob}) and marriage date (${v.marriageDate}) imply the respondent was about ${age} at marriage. Confirm and correct these dates before filing.`,
      });
    }
  }

  if (v.clientDob && v.marriageDate) {
    const age = ageAtDate(v.clientDob, v.marriageDate);
    if (age != null && age < 16) {
      issues.push({
        code: "client_age_at_marriage",
        severity: "error",
        message: `Petitioner birthdate (${v.clientDob}) and marriage date (${v.marriageDate}) imply the petitioner was about ${age} at marriage. Confirm and correct these dates before filing.`,
      });
    }
  }

  if (v.hasRealEstate) {
    for (const property of v.realEstate) {
      const address = String(property.address ?? "a listed property");
      if (property.estimated_value == null || property.estimated_value === "") {
        issues.push({
          code: "real_estate_value_missing",
          severity: "warning",
          message: `Real estate at ${address} has no estimated value. Add it before filing.`,
        });
      }
      const legal = String(property.legal_description ?? property.notes ?? "").trim();
      if (!legal) {
        issues.push({
          code: "real_estate_legal_description_missing",
          severity: "warning",
          message: `Real estate at ${address} has no deed legal description. Add the description from the deed before filing.`,
        });
      }
    }
  }

  if (
    v.hasCommonChildren &&
    v.clientAddress &&
    v.spouseAddress &&
    v.clientAddress !== v.spouseAddress
  ) {
    const bothThroughPresent = v.children.some(
      (ch) => ch.livedWith === "both" && (!ch.livedTo || ch.livedTo === "present")
    );
    if (bothThroughPresent) {
      issues.push({
        code: "residence_both_parents_apart",
        severity: "warning",
        message:
          "A child is listed as living with both parents through the present, but the parents have different addresses. Confirm each residence period and who lived with the child.",
      });
    }
  }

  return issues;
}

export function assertPacketReady(v: CaseFillValues) {
  const issues = validatePacket(v);
  const errors = issues.filter((i) => i.severity === "error");
  if (errors.length === 0) return issues;
  throw new Error(errors.map((e) => e.message).join(" "));
}

export { hasListedCommunityAssets };
