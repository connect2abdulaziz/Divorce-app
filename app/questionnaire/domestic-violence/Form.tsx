"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveSingletonSection } from "@/lib/questionnaire/actions";
import { Field, Select, TextArea, TextInput, YesNo } from "@/components/questionnaire/fields";
import { StepShell } from "@/components/questionnaire/StepShell";

type DomesticViolence = {
  has_domestic_violence: boolean;
  order_of_protection_exists: boolean | null;
  filed_by: string | null;
  date_issued: string | null;
  details: string | null;
};

export function DomesticViolenceForm({
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
  initial: DomesticViolence;
}) {
  const router = useRouter();
  const [hasDv, setHasDv] = useState<boolean | null>(initial.has_domestic_violence ?? null);
  const [hasOrder, setHasOrder] = useState<boolean | null>(initial.order_of_protection_exists);

  async function handleSubmit(formData: FormData) {
    const raw = Object.fromEntries(formData.entries());
    const values = {
      has_domestic_violence: hasDv ?? false,
      order_of_protection_exists: hasDv ? hasOrder ?? false : null,
      filed_by: hasDv ? (raw.filed_by || null) : null,
      date_issued: hasDv ? (raw.date_issued || null) : null,
      details: hasDv ? (raw.details || null) : null,
    };
    await saveSingletonSection("domestic_violence", caseId, values, slug);
    router.push(nextHref);
  }

  return (
    <StepShell
      title="Domestic Violence"
      subtitle="This information helps your attorney understand your safety needs. It's kept confidential within your case file."
      backHref={backHref}
      backLabel={backLabel}
      submitLabel={submitLabel}
      onSubmit={handleSubmit}
    >
      <div>
        <p className="field-label">Has there been any domestic violence in this relationship?</p>
        <YesNo name="has_domestic_violence" value={hasDv} onChange={setHasDv} />
      </div>

      {hasDv === true && (
        <>
          <div>
            <p className="field-label">Is there an existing Order of Protection?</p>
            <YesNo name="order_of_protection_exists" value={hasOrder} onChange={setHasOrder} />
          </div>

          {hasOrder === true && (
            <>
              <Field label="Who filed for the order?">
                <Select
                  name="filed_by"
                  defaultValue={initial.filed_by}
                  options={[
                    { value: "client", label: "Me" },
                    { value: "spouse", label: "Spouse" },
                  ]}
                />
              </Field>
              <Field label="Date issued">
                <TextInput name="date_issued" type="date" defaultValue={initial.date_issued} />
              </Field>
            </>
          )}

          <Field label="Additional details" hint="Optional, but helpful for your attorney.">
            <TextArea name="details" defaultValue={initial.details} rows={4} />
          </Field>
        </>
      )}
    </StepShell>
  );
}
