"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveSingletonSection } from "@/lib/questionnaire/actions";
import { Field, FormDependent, Select, TextArea, TextInput, YesNo } from "@/components/questionnaire/fields";
import { FormNotice } from "@/components/questionnaire/FormNotice";
import { FormSection } from "@/components/questionnaire/FormSection";
import { QuestionBlock } from "@/components/questionnaire/QuestionBlock";
import { StepShell } from "@/components/questionnaire/StepShell";

export type DomesticViolence = {
  has_domestic_violence: boolean | null;
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
  const [error, setError] = useState<string | null>(null);
  const [hasDv, setHasDv] = useState<boolean | null>(
    typeof initial.has_domestic_violence === "boolean" ? initial.has_domestic_violence : null
  );
  const [hasOrder, setHasOrder] = useState<boolean | null>(initial.order_of_protection_exists);

  function buildValues(formData: FormData) {
    return {
      has_domestic_violence: hasDv,
      order_of_protection_exists: hasDv === true ? hasOrder : null,
      filed_by: hasDv === true && hasOrder === true ? emptyToNull(formData.get("filed_by")) : null,
      against_whom:
        hasDv === true && hasOrder === true ? emptyToNull(formData.get("against_whom")) : null,
      date_issued:
        hasDv === true && hasOrder === true ? emptyToNull(formData.get("date_issued")) : null,
      oop_city: hasDv === true && hasOrder === true ? emptyToNull(formData.get("oop_city")) : null,
      oop_state:
        hasDv === true && hasOrder === true ? emptyToNull(formData.get("oop_state")) : null,
      details: hasDv === true ? emptyToNull(formData.get("details")) : null,
    };
  }

  async function handleSubmit(formData: FormData) {
    if (hasDv === null) {
      setError("Please answer whether there has been domestic violence during the marriage.");
      return;
    }
    if (hasDv === true && hasOrder === null) {
      setError("Please answer whether an Order of Protection was obtained.");
      return;
    }
    setError(null);
    await saveSingletonSection("domestic_violence", caseId, buildValues(formData), slug);
    router.push(nextHref);
  }

  async function handleAutoSave(formData: FormData) {
    if (hasDv === null) return;
    await saveSingletonSection("domestic_violence", caseId, buildValues(formData));
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
      {error ? <FormNotice variant="error">{error}</FormNotice> : null}

      <FormSection title="Domestic violence">
        <QuestionBlock required>Has there been domestic violence during the marriage?</QuestionBlock>
        <YesNo name="has_domestic_violence" value={hasDv} onChange={setHasDv} />
      </FormSection>

      {hasDv === true ? (
        <FormDependent>
          <FormSection title="Order of Protection">
            <QuestionBlock required>Was an Order of Protection obtained?</QuestionBlock>
            <YesNo name="order_of_protection_exists" value={hasOrder} onChange={setHasOrder} />

            {hasOrder === true ? (
              <FormDependent>
                <Field label="Who filed it?" htmlFor="filed_by" required>
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
                <Field label="Against whom?" htmlFor="against_whom" required>
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
                <Field label="Date issued" htmlFor="date_issued" optional>
                  <TextInput name="date_issued" type="date" defaultValue={initial.date_issued} />
                </Field>
                <div className="ldd-q-grid ldd-q-grid--2">
                  <Field label="City" htmlFor="oop_city" required>
                    <TextInput name="oop_city" defaultValue={initial.oop_city} required />
                  </Field>
                  <Field label="State" htmlFor="oop_state" required>
                    <TextInput name="oop_state" defaultValue={initial.oop_state} required />
                  </Field>
                </div>
              </FormDependent>
            ) : null}

            <Field label="Additional details" htmlFor="details" optional hint="Optional, but helpful.">
              <TextArea name="details" defaultValue={initial.details} rows={4} />
            </Field>
          </FormSection>
        </FormDependent>
      ) : null}
    </StepShell>
  );
}
