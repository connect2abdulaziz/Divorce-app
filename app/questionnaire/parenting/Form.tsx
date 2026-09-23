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

  async function handleSubmit(formData: FormData) {
    const custody = emptyToNull(formData.get("custody_arrangement"));
    const values = {
      custody_arrangement: custody,
      decision_making:
        custody === "joint"
          ? "Joint legal decision-making"
          : custody === "sole"
            ? "Sole legal decision-making"
            : emptyToNull(formData.get("decision_making")),
      parenting_time_schedule: emptyToNull(formData.get("parenting_time_schedule")),
      visitation_wanted: visitationWanted,
      visitation_denied_reason:
        visitationWanted === false ? emptyToNull(formData.get("visitation_denied_reason")) : null,
      notes: emptyToNull(formData.get("notes")),
    };
    await saveSingletonSection("parenting", caseId, values, slug);
    router.push(nextHref);
  }

  async function handleAutoSave(formData: FormData) {
    const custody = emptyToNull(formData.get("custody_arrangement"));
    await saveSingletonSection("parenting", caseId, {
      custody_arrangement: custody,
      decision_making:
        custody === "joint"
          ? "Joint legal decision-making"
          : custody === "sole"
            ? "Sole legal decision-making"
            : emptyToNull(formData.get("decision_making")),
      parenting_time_schedule: emptyToNull(formData.get("parenting_time_schedule")),
      visitation_wanted: visitationWanted,
      visitation_denied_reason:
        visitationWanted === false ? emptyToNull(formData.get("visitation_denied_reason")) : null,
      notes: emptyToNull(formData.get("notes")),
    });
  }

  const custodyDefault =
    initial.custody_arrangement === "joint" || initial.custody_arrangement === "sole"
      ? initial.custody_arrangement
      : initial.custody_arrangement?.toLowerCase().includes("joint")
        ? "joint"
        : initial.custody_arrangement?.toLowerCase().includes("sole")
          ? "sole"
          : "";

  return (
    <StepShell
      title="Custody & Parenting"
      subtitle="Choose the arrangement you want. You can refine details later with your document preparer."
      backHref={backHref}
      backLabel={backLabel}
      submitLabel={submitLabel}
      onSubmit={handleSubmit}
      onAutoSave={handleAutoSave}
    >
      <Field label="What custody arrangement do you want?">
        <Select
          name="custody_arrangement"
          defaultValue={custodyDefault || null}
          options={[
            { value: "joint", label: "Joint custody" },
            { value: "sole", label: "Sole custody" },
          ]}
          required
        />
      </Field>

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
        <Field label="Proposed parenting-time schedule" hint="Optional details about the schedule you want.">
          <TextArea name="parenting_time_schedule" defaultValue={initial.parenting_time_schedule} rows={3} />
        </Field>
      ) : null}

      <Field label="Additional notes">
        <TextArea name="notes" defaultValue={initial.notes} rows={3} />
      </Field>
    </StepShell>
  );
}
