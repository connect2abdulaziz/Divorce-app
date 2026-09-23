"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateCaseGates } from "@/lib/questionnaire/actions";
import { YesNo } from "@/components/questionnaire/fields";
import { StepFrame } from "@/components/questionnaire/StepFrame";

export function CommunityPropertyForm({
  caseId,
  slug,
  backHref,
  backLabel,
  nextHref,
  submitLabel,
  initial,
}: {
  caseId: string;
  slug: string;
  backHref: string | null;
  backLabel?: string;
  nextHref: string;
  submitLabel?: string;
  initial: boolean | null;
}) {
  const router = useRouter();
  const [hasCommunityProperty, setHasCommunityProperty] = useState<boolean | null>(initial);

  async function handleContinue() {
    const value = hasCommunityProperty ?? false;
    if (!value) {
      await updateCaseGates(
        caseId,
        {
          has_community_property: false,
          has_real_estate: false,
          has_vehicles: false,
          has_retirement_accounts: false,
          has_community_debts: false,
          has_household_property: false,
        },
        slug
      );
    } else {
      await updateCaseGates(caseId, { has_community_property: true }, slug);
    }
    // Server-rendered nextHref used pre-answer gates; Yes opens property sections.
    if (value && !nextHref.includes("review")) {
      router.push("/questionnaire/real-estate");
    } else {
      router.push(nextHref);
    }
  }

  return (
    <StepFrame
      title="Community Property"
      subtitle="Community property is property and debt acquired during the marriage."
      backHref={backHref}
      backLabel={backLabel}
      continueLabel={submitLabel}
      onContinue={handleContinue}
    >
      <div>
        <p className="field-label">Do you have any community property acquired during the marriage?</p>
        <YesNo
          name="has_community_property"
          value={hasCommunityProperty}
          onChange={setHasCommunityProperty}
        />
      </div>
    </StepFrame>
  );
}
