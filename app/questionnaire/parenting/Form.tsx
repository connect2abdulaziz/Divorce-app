"use client";

import { useRouter } from "next/navigation";
import { saveSingletonSection } from "@/lib/questionnaire/actions";
import { Field, TextArea } from "@/components/questionnaire/fields";
import { StepShell } from "@/components/questionnaire/StepShell";

type Parenting = {
  custody_arrangement: string | null;
  decision_making: string | null;
  parenting_time_schedule: string | null;
  notes: string | null;
};

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

  async function handleSubmit(formData: FormData) {
    const values = Object.fromEntries(formData.entries());
    await saveSingletonSection("parenting", caseId, values, slug);
    router.push(nextHref);
  }

  return (
    <StepShell
      title="Custody & Parenting"
      subtitle="Describe what you're proposing. This doesn't need to be final — your attorney will help refine it."
      backHref={backHref}
      backLabel={backLabel}
      submitLabel={submitLabel}
      onSubmit={handleSubmit}
    >
      <Field label="Proposed custody arrangement" hint="e.g. joint legal decision-making, primary residential parent, etc.">
        <TextArea name="custody_arrangement" defaultValue={initial.custody_arrangement} rows={3} />
      </Field>
      <Field label="Legal decision-making" hint="Who makes decisions about education, health care, religion, etc.?">
        <TextArea name="decision_making" defaultValue={initial.decision_making} rows={3} />
      </Field>
      <Field label="Proposed parenting-time schedule">
        <TextArea name="parenting_time_schedule" defaultValue={initial.parenting_time_schedule} rows={3} />
      </Field>
      <Field label="Additional notes">
        <TextArea name="notes" defaultValue={initial.notes} rows={3} />
      </Field>
    </StepShell>
  );
}
