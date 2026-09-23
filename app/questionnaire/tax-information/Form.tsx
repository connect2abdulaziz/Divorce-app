"use client";

import { useRouter } from "next/navigation";
import { saveSingletonSection } from "@/lib/questionnaire/actions";
import { Field, Select, TextArea } from "@/components/questionnaire/fields";
import { StepShell } from "@/components/questionnaire/StepShell";

type TaxInformation = {
  filing_status?: string | null;
  dependents_claimed_by: string | null;
  claim_frequency: string | null;
  notes: string | null;
};

function emptyToNull(value: FormDataEntryValue | null) {
  const s = String(value ?? "").trim();
  return s === "" ? null : s;
}

function normalizeClaimedBy(value: string | null) {
  if (value === "client" || value === "spouse") return value;
  return null;
}

function normalizeFrequency(value: string | null, claimedBy: string | null) {
  if (value === "every_year" || value === "alternate_years") return value;
  // Legacy: "alternate" lived on dependents_claimed_by
  if (claimedBy === "alternate") return "alternate_years";
  return null;
}

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
  const claimedDefault = normalizeClaimedBy(initial.dependents_claimed_by);
  const frequencyDefault = normalizeFrequency(initial.claim_frequency, initial.dependents_claimed_by);

  function buildValues(formData: FormData) {
    return {
      dependents_claimed_by: emptyToNull(formData.get("dependents_claimed_by")),
      claim_frequency: emptyToNull(formData.get("claim_frequency")),
      notes: emptyToNull(formData.get("notes")),
    };
  }

  async function handleSubmit(formData: FormData) {
    await saveSingletonSection("tax_information", caseId, buildValues(formData), slug);
    router.push(nextHref);
  }

  async function handleAutoSave(formData: FormData) {
    await saveSingletonSection("tax_information", caseId, buildValues(formData));
  }

  return (
    <StepShell
      title="Tax Information"
      subtitle="Who will claim the children as dependents on tax returns going forward?"
      backHref={backHref}
      backLabel={backLabel}
      submitLabel={submitLabel}
      onSubmit={handleSubmit}
      onAutoSave={handleAutoSave}
    >
      <Field label="Who will claim the dependents?">
        <Select
          name="dependents_claimed_by"
          defaultValue={claimedDefault}
          options={[
            { value: "client", label: "Me" },
            { value: "spouse", label: "Spouse" },
          ]}
          required
        />
      </Field>
      <Field label="How often?">
        <Select
          name="claim_frequency"
          defaultValue={frequencyDefault}
          options={[
            { value: "every_year", label: "Every year" },
            { value: "alternate_years", label: "Alternate years" },
          ]}
          required
        />
      </Field>
      <Field label="Additional notes">
        <TextArea name="notes" defaultValue={initial.notes} rows={3} />
      </Field>
    </StepShell>
  );
}
