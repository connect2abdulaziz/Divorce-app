"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveSingletonSection } from "@/lib/questionnaire/actions";
import { CurrencyInput, Field, Select, TextInput } from "@/components/questionnaire/fields";
import { StepShell } from "@/components/questionnaire/StepShell";

type Employment = {
  client_status: string | null;
  client_employer_name: string | null;
  client_employer_address: string | null;
  client_annual_income: number | null;
  spouse_status: string | null;
  spouse_employer_name: string | null;
  spouse_employer_address: string | null;
  spouse_annual_income: number | null;
};

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
    const raw = Object.fromEntries(formData.entries());
    const values = {
      ...raw,
      client_annual_income: raw.client_annual_income ? Number(raw.client_annual_income) : null,
      spouse_annual_income: raw.spouse_annual_income ? Number(raw.spouse_annual_income) : null,
    };
    await saveSingletonSection("employment", caseId, values, slug);
    router.push(nextHref);
  }

  return (
    <StepShell
      title="Employment & Income"
      backHref={backHref}
      backLabel={backLabel}
      submitLabel={submitLabel}
      onSubmit={handleSubmit}
    >
      <div className="space-y-5 border-b border-line/70 pb-7">
        <p className="text-sm font-medium tracking-wide text-accent">Your employment</p>
        <Field label="Are you currently employed?">
          <Select
            name="client_status"
            value={clientStatus}
            onChange={setClientStatus}
            options={[
              { value: "employed", label: "Employed" },
              { value: "not_employed", label: "Not employed" },
            ]}
            required
          />
        </Field>

        {clientStatus === "employed" && (
          <>
            <Field label="Employer name">
              <TextInput name="client_employer_name" defaultValue={initial.client_employer_name} />
            </Field>
            <Field label="Employer address">
              <TextInput name="client_employer_address" defaultValue={initial.client_employer_address} />
            </Field>
            <Field label="Annual income">
              <CurrencyInput name="client_annual_income" defaultValue={initial.client_annual_income} />
            </Field>
          </>
        )}
      </div>

      <div className="space-y-5">
        <p className="text-sm font-medium tracking-wide text-accent">Spouse&apos;s employment</p>
        <Field label="Is your spouse currently employed?">
          <Select
            name="spouse_status"
            value={spouseStatus}
            onChange={setSpouseStatus}
            options={[
              { value: "employed", label: "Employed" },
              { value: "not_employed", label: "Not employed" },
              { value: "unknown", label: "I don't know" },
            ]}
            required
          />
        </Field>

        {spouseStatus === "employed" && (
          <>
            <Field label="Spouse's employer name">
              <TextInput name="spouse_employer_name" defaultValue={initial.spouse_employer_name} />
            </Field>
            <Field label="Spouse's employer address">
              <TextInput name="spouse_employer_address" defaultValue={initial.spouse_employer_address} />
            </Field>
            <Field label="Spouse's annual income" hint="Enter your best estimate if exact figures aren't available.">
              <CurrencyInput name="spouse_annual_income" defaultValue={initial.spouse_annual_income} />
            </Field>
          </>
        )}
      </div>
    </StepShell>
  );
}
