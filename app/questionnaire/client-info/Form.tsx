"use client";

import { useRouter } from "next/navigation";
import { saveSingletonSection } from "@/lib/questionnaire/actions";
import { Field, NumberInput, TextInput } from "@/components/questionnaire/fields";
import { StepShell } from "@/components/questionnaire/StepShell";

export type PartyClient = {
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  height: string | null;
  weight_lbs: number | null;
  az_years: number | null;
  az_months: number | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  home_phone: string | null;
  cell_phone: string | null;
  phone: string | null;
  email: string | null;
  ssn_last4: string | null;
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

export function ClientInfoForm({
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
  initial: PartyClient;
}) {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const home = emptyToNull(formData.get("home_phone"));
    const cell = emptyToNull(formData.get("cell_phone"));
    const values = {
      first_name: emptyToNull(formData.get("first_name")),
      middle_name: emptyToNull(formData.get("middle_name")),
      last_name: emptyToNull(formData.get("last_name")),
      date_of_birth: emptyToNull(formData.get("date_of_birth")),
      height: emptyToNull(formData.get("height")),
      weight_lbs: numberOrNull(formData.get("weight_lbs")),
      az_years: numberOrNull(formData.get("az_years")),
      az_months: numberOrNull(formData.get("az_months")),
      address_line1: emptyToNull(formData.get("address_line1")),
      address_line2: emptyToNull(formData.get("address_line2")),
      city: emptyToNull(formData.get("city")),
      state: emptyToNull(formData.get("state")),
      zip: emptyToNull(formData.get("zip")),
      home_phone: home,
      cell_phone: cell,
      phone: cell ?? home,
      email: emptyToNull(formData.get("email")),
      ssn_last4: emptyToNull(formData.get("ssn_last4")),
    };
    await saveSingletonSection("party_client", caseId, values, slug);
    router.push(nextHref);
  }

  async function handleAutoSave(formData: FormData) {
    const home = emptyToNull(formData.get("home_phone"));
    const cell = emptyToNull(formData.get("cell_phone"));
    await saveSingletonSection("party_client", caseId, {
      first_name: emptyToNull(formData.get("first_name")),
      middle_name: emptyToNull(formData.get("middle_name")),
      last_name: emptyToNull(formData.get("last_name")),
      date_of_birth: emptyToNull(formData.get("date_of_birth")),
      height: emptyToNull(formData.get("height")),
      weight_lbs: numberOrNull(formData.get("weight_lbs")),
      az_years: numberOrNull(formData.get("az_years")),
      az_months: numberOrNull(formData.get("az_months")),
      address_line1: emptyToNull(formData.get("address_line1")),
      address_line2: emptyToNull(formData.get("address_line2")),
      city: emptyToNull(formData.get("city")),
      state: emptyToNull(formData.get("state")),
      zip: emptyToNull(formData.get("zip")),
      home_phone: home,
      cell_phone: cell,
      phone: cell ?? home,
      email: emptyToNull(formData.get("email")),
      ssn_last4: emptyToNull(formData.get("ssn_last4")),
    });
  }

  return (
    <StepShell
      title="Your Information"
      backHref={backHref}
      backLabel={backLabel}
      submitLabel={submitLabel}
      onSubmit={handleSubmit}
      onAutoSave={handleAutoSave}
    >
      <div className="grid gap-6 sm:grid-cols-3">
        <Field label="First name">
          <TextInput name="first_name" defaultValue={initial.first_name} required autoComplete="given-name" />
        </Field>
        <Field label="Middle name">
          <TextInput name="middle_name" defaultValue={initial.middle_name} autoComplete="additional-name" />
        </Field>
        <Field label="Last name">
          <TextInput name="last_name" defaultValue={initial.last_name} required autoComplete="family-name" />
        </Field>
      </div>

      <Field label="Date of birth">
        <TextInput name="date_of_birth" type="date" defaultValue={initial.date_of_birth} required />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Height" hint="Example: 5'8&quot; or 68 in.">
          <TextInput name="height" defaultValue={initial.height} placeholder='e.g. 5&apos;8"' required />
        </Field>
        <Field label="Weight" hint="Pounds (lbs).">
          <NumberInput name="weight_lbs" defaultValue={initial.weight_lbs} min={0} step="0.1" required />
        </Field>
      </div>

      <div>
        <p className="field-label">How long have you lived in Arizona?</p>
        <div className="mt-2 grid gap-6 sm:grid-cols-2">
          <Field label="Years">
            <NumberInput name="az_years" defaultValue={initial.az_years} min={0} step="1" required />
          </Field>
          <Field label="Months">
            <NumberInput name="az_months" defaultValue={initial.az_months} min={0} step="1" required />
          </Field>
        </div>
      </div>

      <Field label="Street address">
        <TextInput name="address_line1" defaultValue={initial.address_line1} required autoComplete="street-address" />
      </Field>
      <Field label="Apartment / unit">
        <TextInput name="address_line2" defaultValue={initial.address_line2} placeholder="Optional" />
      </Field>
      <div className="grid gap-6 sm:grid-cols-3">
        <Field label="City">
          <TextInput name="city" defaultValue={initial.city} required autoComplete="address-level2" />
        </Field>
        <Field label="State">
          <TextInput name="state" defaultValue={initial.state ?? "AZ"} required autoComplete="address-level1" />
        </Field>
        <Field label="ZIP">
          <TextInput name="zip" defaultValue={initial.zip} required autoComplete="postal-code" />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Home phone">
          <TextInput
            name="home_phone"
            type="tel"
            defaultValue={initial.home_phone ?? initial.phone}
            autoComplete="tel"
          />
        </Field>
        <Field label="Cell phone">
          <TextInput name="cell_phone" type="tel" defaultValue={initial.cell_phone} required />
        </Field>
      </div>

      <Field label="Email">
        <TextInput name="email" type="email" defaultValue={initial.email} required autoComplete="email" />
      </Field>

      <Field label="Social Security number (last 4 digits)" hint="Exactly 4 digits. Sensitive information.">
        <TextInput
          name="ssn_last4"
          defaultValue={initial.ssn_last4}
          required
          maxLength={4}
          pattern="[0-9]{4}"
          inputMode="numeric"
          placeholder="####"
          autoComplete="off"
        />
      </Field>
    </StepShell>
  );
}
