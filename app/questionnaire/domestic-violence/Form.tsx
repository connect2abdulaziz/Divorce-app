"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveSingletonSection } from "@/lib/questionnaire/actions";
import { Field, Select, TextArea, TextInput, YesNo } from "@/components/questionnaire/fields";
import { StepShell } from "@/components/questionnaire/StepShell";

export type DomesticViolence = {
  has_domestic_violence: boolean;
  order_of_protection_exists: boolean | null;
  filed_by: string | null;
  against_whom: string | null;
  date_issued: string | null;
  oop_city: string | null;
  oop_state: string | null;
  details: string | null;
};

function emptyToNull(value: FormDataEntryValue | null) {
  const s = String(value ?? "").trim();
  return s === "" ? null : s;
}

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
    const values = {
      has_domestic_violence: hasDv ?? false,
      order_of_protection_exists: hasDv ? hasOrder ?? false : null,
      filed_by: hasDv && hasOrder ? emptyToNull(formData.get("filed_by")) : null,
      against_whom: hasDv && hasOrder ? emptyToNull(formData.get("against_whom")) : null,
      date_issued: hasDv && hasOrder ? emptyToNull(formData.get("date_issued")) : null,
      oop_city: hasDv && hasOrder ? emptyToNull(formData.get("oop_city")) : null,
      oop_state: hasDv && hasOrder ? emptyToNull(formData.get("oop_state")) : null,
      details: hasDv ? emptyToNull(formData.get("details")) : null,
    };
    await saveSingletonSection("domestic_violence", caseId, values, slug);
    router.push(nextHref);
  }

  async function handleAutoSave(formData: FormData) {
    await saveSingletonSection("domestic_violence", caseId, {
      has_domestic_violence: hasDv ?? false,
      order_of_protection_exists: hasDv ? hasOrder ?? false : null,
      filed_by: hasDv && hasOrder ? emptyToNull(formData.get("filed_by")) : null,
      against_whom: hasDv && hasOrder ? emptyToNull(formData.get("against_whom")) : null,
      date_issued: hasDv && hasOrder ? emptyToNull(formData.get("date_issued")) : null,
      oop_city: hasDv && hasOrder ? emptyToNull(formData.get("oop_city")) : null,
      oop_state: hasDv && hasOrder ? emptyToNull(formData.get("oop_state")) : null,
      details: hasDv ? emptyToNull(formData.get("details")) : null,
    });
  }

  return (
    <StepShell
      title="Domestic Violence"
      subtitle="This information helps with your case. It is kept confidential within your case file."
      backHref={backHref}
      backLabel={backLabel}
      submitLabel={submitLabel}
      onSubmit={handleSubmit}
      onAutoSave={handleAutoSave}
    >
      <div>
        <p className="field-label">Has there been domestic violence during the marriage?</p>
        <YesNo name="has_domestic_violence" value={hasDv} onChange={setHasDv} />
      </div>

      {hasDv === true ? (
        <>
          <div>
            <p className="field-label">Was an Order of Protection obtained?</p>
            <YesNo name="order_of_protection_exists" value={hasOrder} onChange={setHasOrder} />
          </div>

          {hasOrder === true ? (
            <>
              <Field label="Who filed it?">
                <Select
                  name="filed_by"
                  defaultValue={initial.filed_by}
                  options={[
                    { value: "client", label: "Me" },
                    { value: "spouse", label: "Spouse" },
                  ]}
                  required
                />
              </Field>
              <Field label="Against whom?">
                <Select
                  name="against_whom"
                  defaultValue={initial.against_whom}
                  options={[
                    { value: "client", label: "Me" },
                    { value: "spouse", label: "Spouse" },
                    { value: "both", label: "Both" },
                    { value: "other", label: "Other" },
                  ]}
                  required
                />
              </Field>
              <Field label="Date issued">
                <TextInput name="date_issued" type="date" defaultValue={initial.date_issued} />
              </Field>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="City">
                  <TextInput name="oop_city" defaultValue={initial.oop_city} required />
                </Field>
                <Field label="State">
                  <TextInput name="oop_state" defaultValue={initial.oop_state} required />
                </Field>
              </div>
            </>
          ) : null}

          <Field label="Additional details" hint="Optional, but helpful.">
            <TextArea name="details" defaultValue={initial.details} rows={4} />
          </Field>
        </>
      ) : null}
    </StepShell>
  );
}
