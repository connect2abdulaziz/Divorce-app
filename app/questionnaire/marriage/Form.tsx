"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveSingletonSection, updateCaseGates } from "@/lib/questionnaire/actions";
import { Field, TextInput, YesNo } from "@/components/questionnaire/fields";
import { StepShell } from "@/components/questionnaire/StepShell";

type Marriage = {
  marriage_date: string | null;
  separation_date: string | null;
  marriage_location: string | null;
  grounds: string | null;
  due_date: string | null;
};

export function MarriageForm({
  caseId,
  slug,
  backHref,
  backLabel,
  nextHref,
  submitLabel,
  initial,
  initialPregnant,
}: {
  caseId: string;
  slug: string;
  backHref: string | null;
  backLabel?: string;
  nextHref: string;
  submitLabel?: string;
  initial: Marriage;
  initialPregnant: boolean | null;
}) {
  const router = useRouter();
  const [pregnant, setPregnant] = useState<boolean | null>(initialPregnant);

  async function handleSubmit(formData: FormData) {
    const values = Object.fromEntries(formData.entries());
    await updateCaseGates(caseId, { is_spouse_pregnant: pregnant ?? false });
    await saveSingletonSection("marriage", caseId, values, slug);
    router.push(nextHref);
  }

  return (
    <StepShell
      title="Marriage & Separation"
      backHref={backHref}
      backLabel={backLabel}
      submitLabel={submitLabel}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Date of marriage">
          <TextInput name="marriage_date" type="date" defaultValue={initial.marriage_date} required />
        </Field>
        <Field label="Date of separation" hint="Leave blank if you haven't separated yet.">
          <TextInput name="separation_date" type="date" defaultValue={initial.separation_date} />
        </Field>
      </div>
      <Field label="Place of marriage" hint="City and state (or country).">
        <TextInput name="marriage_location" defaultValue={initial.marriage_location} />
      </Field>
      <Field label="Grounds for divorce" hint="Arizona is a no-fault state; most cases say 'marriage is irretrievably broken.'">
        <TextInput name="grounds" defaultValue={initial.grounds ?? "Marriage is irretrievably broken"} />
      </Field>

      <div>
        <p className="field-label">Is your spouse currently pregnant?</p>
        <YesNo name="is_spouse_pregnant" value={pregnant} onChange={setPregnant} />
      </div>

      {pregnant === true && (
        <Field label="Expected due date">
          <TextInput name="due_date" type="date" defaultValue={initial.due_date} />
        </Field>
      )}
    </StepShell>
  );
}
