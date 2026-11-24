"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveSingletonSection } from "@/lib/questionnaire/actions";
import {
  CurrencyInput,
  Field,
  PhoneInput,
  sanitizePhone,
  Select,
  TextInput,
} from "@/components/questionnaire/fields";
import { FormSection } from "@/components/questionnaire/FormSection";
import { StepShell } from "@/components/questionnaire/StepShell";
import { FormDependent } from "@/components/questionnaire/fields";

export type Employment = {
  client_status: string | null;
  client_employer_name: string | null;
  client_position: string | null;
  client_employer_phone: string | null;
  client_employer_address: string | null;
  client_employer_city: string | null;
  client_employer_state: string | null;
  client_employer_zip: string | null;
  client_monthly_income: number | null;
  client_annual_income: number | null;
  spouse_status: string | null;
  spouse_employer_name: string | null;
  spouse_position: string | null;
  spouse_employer_phone: string | null;
  spouse_employer_address: string | null;
  spouse_employer_city: string | null;
  spouse_employer_state: string | null;
  spouse_employer_zip: string | null;
  spouse_monthly_income: number | null;
  spouse_annual_income: number | null;
};

function emptyToNull(value: FormDataEntryValue | null) {
  const s = String(value ?? "").trim();
  return s === "" ? null : s;
}

function numberOrNull(value: FormDataEntryValue | null) {
  const s = String(value ?? "").trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export function EmploymentForm({
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
  initial: Employment;
}) {
  const router = useRouter();
  const [clientStatus, setClientStatus] = useState(initial.client_status ?? "");
  const [spouseStatus, setSpouseStatus] = useState(initial.spouse_status ?? "");

  async function handleSubmit(formData: FormData) {
    const clientMonthly = numberOrNull(formData.get("client_monthly_income"));
    const spouseMonthly = numberOrNull(formData.get("spouse_monthly_income"));
    const values = {
      client_status: emptyToNull(formData.get("client_status")),
      client_employer_name: emptyToNull(formData.get("client_employer_name")),
      client_position: emptyToNull(formData.get("client_position")),
      client_employer_phone: sanitizePhone(String(formData.get("client_employer_phone") ?? "")),
      client_employer_address: emptyToNull(formData.get("client_employer_address")),
      client_employer_city: emptyToNull(formData.get("client_employer_city")),
      client_employer_state: emptyToNull(formData.get("client_employer_state")),
      client_employer_zip: emptyToNull(formData.get("client_employer_zip")),
      client_monthly_income: clientMonthly,
      client_annual_income: clientMonthly != null ? clientMonthly * 12 : numberOrNull(formData.get("client_annual_income")),
      spouse_status: emptyToNull(formData.get("spouse_status")),
      spouse_employer_name: emptyToNull(formData.get("spouse_employer_name")),
      spouse_position: emptyToNull(formData.get("spouse_position")),
      spouse_employer_phone: sanitizePhone(String(formData.get("spouse_employer_phone") ?? "")),
      spouse_employer_address: emptyToNull(formData.get("spouse_employer_address")),
      spouse_employer_city: emptyToNull(formData.get("spouse_employer_city")),
      spouse_employer_state: emptyToNull(formData.get("spouse_employer_state")),
      spouse_employer_zip: emptyToNull(formData.get("spouse_employer_zip")),
      spouse_monthly_income: spouseMonthly,
      spouse_annual_income: spouseMonthly != null ? spouseMonthly * 12 : numberOrNull(formData.get("spouse_annual_income")),
    };
    await saveSingletonSection("employment", caseId, values, slug);
    router.push(nextHref);
  }

  async function handleAutoSave(formData: FormData) {
    const clientMonthly = numberOrNull(formData.get("client_monthly_income"));
    const spouseMonthly = numberOrNull(formData.get("spouse_monthly_income"));
    await saveSingletonSection("employment", caseId, {
      client_status: emptyToNull(formData.get("client_status")),
      client_employer_name: emptyToNull(formData.get("client_employer_name")),
      client_position: emptyToNull(formData.get("client_position")),
      client_employer_phone: sanitizePhone(String(formData.get("client_employer_phone") ?? "")),
      client_employer_address: emptyToNull(formData.get("client_employer_address")),
      client_employer_city: emptyToNull(formData.get("client_employer_city")),
      client_employer_state: emptyToNull(formData.get("client_employer_state")),
      client_employer_zip: emptyToNull(formData.get("client_employer_zip")),
      client_monthly_income: clientMonthly,
      client_annual_income: clientMonthly != null ? clientMonthly * 12 : numberOrNull(formData.get("client_annual_income")),
      spouse_status: emptyToNull(formData.get("spouse_status")),
      spouse_employer_name: emptyToNull(formData.get("spouse_employer_name")),
      spouse_position: emptyToNull(formData.get("spouse_position")),
      spouse_employer_phone: sanitizePhone(String(formData.get("spouse_employer_phone") ?? "")),
      spouse_employer_address: emptyToNull(formData.get("spouse_employer_address")),
      spouse_employer_city: emptyToNull(formData.get("spouse_employer_city")),
      spouse_employer_state: emptyToNull(formData.get("spouse_employer_state")),
      spouse_employer_zip: emptyToNull(formData.get("spouse_employer_zip")),
      spouse_monthly_income: spouseMonthly,
      spouse_annual_income: spouseMonthly != null ? spouseMonthly * 12 : numberOrNull(formData.get("spouse_annual_income")),
    });
  }

  return (
    <StepShell
      title="Employment & Income"
      backHref={backHref}
      backLabel={backLabel}
      submitLabel={submitLabel}
      onSubmit={handleSubmit}
      onAutoSave={handleAutoSave}
    >
      <FormSection title="Your employment">
        <Field label="Are you currently employed?" htmlFor="client_status" required>
          <Select
            name="client_status"
            value={clientStatus}
            onChange={setClientStatus}
            options={[
              { value: "employed", label: "Yes" },
              { value: "not_employed", label: "No" },
            ]}
            required
          />
        </Field>

        {clientStatus === "employed" ? (
          <FormDependent>
            <Field label="Employer name" htmlFor="client_employer_name" required>
              <TextInput name="client_employer_name" defaultValue={initial.client_employer_name} required />
            </Field>
            <Field label="Position / occupation" htmlFor="client_position" required>
              <TextInput name="client_position" defaultValue={initial.client_position} required />
            </Field>
            <Field label="Employer phone" htmlFor="client_employer_phone" required>
              <PhoneInput
                name="client_employer_phone"
                defaultValue={initial.client_employer_phone}
                required
              />
            </Field>
            <Field label="Monthly salary / income" htmlFor="client_monthly_income" required>
              <CurrencyInput name="client_monthly_income" defaultValue={initial.client_monthly_income} required />
            </Field>
            <Field label="Employer street address" htmlFor="client_employer_address" required>
              <TextInput name="client_employer_address" defaultValue={initial.client_employer_address} required />
            </Field>
            <div className="ldd-q-grid ldd-q-grid--3">
              <Field label="City" htmlFor="client_employer_city" required>
                <TextInput name="client_employer_city" defaultValue={initial.client_employer_city} required />
              </Field>
              <Field label="State" htmlFor="client_employer_state" required>
                <TextInput name="client_employer_state" defaultValue={initial.client_employer_state} required />
              </Field>
              <Field label="ZIP" htmlFor="client_employer_zip" required>
                <TextInput name="client_employer_zip" defaultValue={initial.client_employer_zip} required />
              </Field>
            </div>
          </FormDependent>
        ) : null}
      </FormSection>

      <FormSection title="Spouse's employment">
        <Field label="Is your spouse currently employed?" htmlFor="spouse_status" required>
          <Select
            name="spouse_status"
            value={spouseStatus}
            onChange={setSpouseStatus}
            options={[
              { value: "employed", label: "Yes" },
              { value: "not_employed", label: "No" },
              { value: "unknown", label: "Unknown" },
            ]}
            required
          />
        </Field>

        {spouseStatus === "employed" ? (
          <FormDependent>
            <Field label="Employer name" htmlFor="spouse_employer_name" optional>
              <TextInput name="spouse_employer_name" defaultValue={initial.spouse_employer_name} />
            </Field>
            <Field label="Position / occupation" htmlFor="spouse_position" optional>
              <TextInput name="spouse_position" defaultValue={initial.spouse_position} />
            </Field>
            <Field label="Employer phone" htmlFor="spouse_employer_phone" optional>
              <PhoneInput name="spouse_employer_phone" defaultValue={initial.spouse_employer_phone} />
            </Field>
            <Field label="Monthly salary / income" htmlFor="spouse_monthly_income" optional hint="Best estimate is fine.">
              <CurrencyInput name="spouse_monthly_income" defaultValue={initial.spouse_monthly_income} />
            </Field>
            <Field label="Employer street address" htmlFor="spouse_employer_address" optional>
              <TextInput name="spouse_employer_address" defaultValue={initial.spouse_employer_address} />
            </Field>
            <div className="ldd-q-grid ldd-q-grid--3">
              <Field label="City" htmlFor="spouse_employer_city" optional>
                <TextInput name="spouse_employer_city" defaultValue={initial.spouse_employer_city} />
              </Field>
              <Field label="State" htmlFor="spouse_employer_state" optional>
                <TextInput name="spouse_employer_state" defaultValue={initial.spouse_employer_state} />
              </Field>
              <Field label="ZIP" htmlFor="spouse_employer_zip" optional>
                <TextInput name="spouse_employer_zip" defaultValue={initial.spouse_employer_zip} />
              </Field>
            </div>
          </FormDependent>
        ) : null}
      </FormSection>
    </StepShell>
  );
}
