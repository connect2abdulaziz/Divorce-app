"use client";

import { useRouter } from "next/navigation";
import { saveSingletonSection } from "@/lib/questionnaire/actions";
import { Field, Select, TextArea, TextInput } from "@/components/questionnaire/fields";
import { StepShell } from "@/components/questionnaire/StepShell";

type TaxInformation = {
  filing_status: string | null;
  dependents_claimed_by: string | null;
  notes: string | null;
};

export function TaxInformationForm({
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
  initial: TaxInformation;
}) {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const values = Object.fromEntries(formData.entries());
    await saveSingletonSection("tax_information", caseId, values, slug);
    router.push(nextHref);
  }

  return (
    <StepShell
      title="Tax Information"
      backHref={backHref}
      backLabel={backLabel}
      submitLabel={submitLabel}
      onSubmit={handleSubmit}
    >
      <Field label="Most recent filing status">
        <TextInput name="filing_status" defaultValue={initial.filing_status} placeholder="e.g. Married filing jointly" />
      </Field>
      <Field label="Who will claim the dependents going forward?">
        <Select
          name="dependents_claimed_by"
          defaultValue={initial.dependents_claimed_by}
          options={[
            { value: "client", label: "Me" },
            { value: "spouse", label: "Spouse" },
            { value: "split", label: "Split evenly" },
            { value: "alternate", label: "Alternate by year" },
          ]}
        />
      </Field>
      <Field label="Additional notes">
        <TextArea name="notes" defaultValue={initial.notes} rows={3} />
      </Field>
    </StepShell>
  );
}
