"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveSingletonSection } from "@/lib/questionnaire/actions";
import { Field, Select, TextArea, YesNo } from "@/components/questionnaire/fields";
import { StepShell } from "@/components/questionnaire/StepShell";

export type Parenting = {
  custody_arrangement: string | null;
  decision_making: string | null;
  parenting_time_schedule: string | null;
  visitation_wanted: boolean | null;
  visitation_denied_reason: string | null;
  joint_by_agreement: boolean | null;
  notes: string | null;
};

function emptyToNull(value: FormDataEntryValue | null) {
  const s = String(value ?? "").trim();
  return s === "" ? null : s;
}

export function ParentingForm({
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
  initial: Parenting;
}) {
  const router = useRouter();
  const [visitationWanted, setVisitationWanted] = useState<boolean | null>(initial.visitation_wanted);
  const [custody, setCustody] = useState<string>(
    initial.custody_arrangement === "joint" || initial.custody_arrangement === "sole"
      ? initial.custody_arrangement
      : initial.custody_arrangement?.toLowerCase().includes("joint")
        ? "joint"
        : initial.custody_arrangement?.toLowerCase().includes("sole")
          ? "sole"
          : ""
  );
  const [jointByAgreement, setJointByAgreement] = useState<boolean | null>(
    initial.joint_by_agreement
  );

  function buildValues(formData: FormData) {
    const custodyValue = emptyToNull(formData.get("custody_arrangement")) || custody || null;
    return {
      custody_arrangement: custodyValue,
      decision_making:
        custodyValue === "joint"
          ? "Joint legal decision-making"
          : custodyValue === "sole"
            ? "Sole legal decision-making"
            : emptyToNull(formData.get("decision_making")),
      parenting_time_schedule: emptyToNull(formData.get("parenting_time_schedule")),
      visitation_wanted: visitationWanted,
      visitation_denied_reason:
        visitationWanted === false ? emptyToNull(formData.get("visitation_denied_reason")) : null,
      joint_by_agreement: custodyValue === "joint" ? jointByAgreement : null,
      notes: emptyToNull(formData.get("notes")),
    };
  }

  async function handleSubmit(formData: FormData) {
    await saveSingletonSection("parenting", caseId, buildValues(formData), slug);
    router.push(nextHref);
  }

  async function handleAutoSave(formData: FormData) {
    await saveSingletonSection("parenting", caseId, buildValues(formData));
  }

  return (
    <StepShell
      title="Custody & Parenting"
      subtitle="Choose the arrangement you want. Be specific about weekends, weekdays, and exchanges so the parenting plan can be filled correctly."
      backHref={backHref}
      backLabel={backLabel}
      submitLabel={submitLabel}
      onSubmit={handleSubmit}
      onAutoSave={handleAutoSave}
    >
      <Field label="What custody arrangement do you want?">
        <Select
          name="custody_arrangement"
          value={custody}
          onChange={setCustody}
          options={[
            { value: "joint", label: "Joint custody" },
            { value: "sole", label: "Sole custody" },
          ]}
          required
        />
      </Field>

      {custody === "joint" ? (
        <div>
          <p className="field-label">Do both parents agree to joint legal decision-making?</p>
          <YesNo name="joint_by_agreement" value={jointByAgreement} onChange={setJointByAgreement} />
          <p className="field-hint">
            Choose Yes only if both parents already agree. If you alone are requesting joint
            decision-making, choose No.
          </p>
        </div>
      ) : null}

      <div>
        <p className="field-label">Do you want your spouse to have visitation / parenting time?</p>
        <YesNo name="visitation_wanted" value={visitationWanted} onChange={setVisitationWanted} />
      </div>

      {visitationWanted === false ? (
        <Field label="Please explain why">
          <TextArea
            name="visitation_denied_reason"
            defaultValue={initial.visitation_denied_reason}
            rows={4}
            required
          />
        </Field>
      ) : null}

      {visitationWanted === true ? (
        <Field
          label="Proposed parenting-time schedule"
          hint="Specify who has which weekends, weekday evenings/overnights, start and end times, and exchange location. Example: Party A — weekdays; Party B — every other weekend Fri 6pm–Sun 6pm; exchanges at school."
        >
          <TextArea name="parenting_time_schedule" defaultValue={initial.parenting_time_schedule} rows={5} />
        </Field>
      ) : null}

      <Field label="Additional notes">
        <TextArea name="notes" defaultValue={initial.notes} rows={3} />
      </Field>
    </StepShell>
  );
}
