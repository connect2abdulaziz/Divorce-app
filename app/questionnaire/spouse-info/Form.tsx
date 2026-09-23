"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveSingletonSection } from "@/lib/questionnaire/actions";
import { Checkbox, Field, NumberInput, TextInput } from "@/components/questionnaire/fields";
import { StepShell } from "@/components/questionnaire/StepShell";

export type PartySpouse = {
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
  address_unknown: boolean | null;
  phone_unknown: boolean | null;
  ssn_unknown: boolean | null;
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

export function SpouseInfoForm({
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
  initial: PartySpouse;
}) {
  const router = useRouter();
  const [addressUnknown, setAddressUnknown] = useState(Boolean(initial.address_unknown));
  const [phoneUnknown, setPhoneUnknown] = useState(Boolean(initial.phone_unknown));
  const [ssnUnknown, setSsnUnknown] = useState(Boolean(initial.ssn_unknown));

  async function handleSubmit(formData: FormData) {
    const addressIsUnknown = formData.get("address_unknown") === "true";
    const phoneIsUnknown = formData.get("phone_unknown") === "true";
    const ssnIsUnknown = formData.get("ssn_unknown") === "true";
    const home = phoneIsUnknown ? null : emptyToNull(formData.get("home_phone"));
    const cell = phoneIsUnknown ? null : emptyToNull(formData.get("cell_phone"));

    const values = {
      first_name: emptyToNull(formData.get("first_name")),
      middle_name: emptyToNull(formData.get("middle_name")),
      last_name: emptyToNull(formData.get("last_name")),
      date_of_birth: emptyToNull(formData.get("date_of_birth")),
      height: emptyToNull(formData.get("height")),
      weight_lbs: numberOrNull(formData.get("weight_lbs")),
      az_years: numberOrNull(formData.get("az_years")),
      az_months: numberOrNull(formData.get("az_months")),
      address_unknown: addressIsUnknown,
      address_line1: addressIsUnknown ? null : emptyToNull(formData.get("address_line1")),
      address_line2: addressIsUnknown ? null : emptyToNull(formData.get("address_line2")),
      city: addressIsUnknown ? null : emptyToNull(formData.get("city")),
      state: addressIsUnknown ? null : emptyToNull(formData.get("state")),
      zip: addressIsUnknown ? null : emptyToNull(formData.get("zip")),
      phone_unknown: phoneIsUnknown,
      home_phone: home,
      cell_phone: cell,
      phone: cell ?? home,
      email: emptyToNull(formData.get("email")),
      ssn_unknown: ssnIsUnknown,
      ssn_last4: ssnIsUnknown ? null : emptyToNull(formData.get("ssn_last4")),
    };
    await saveSingletonSection("party_spouse", caseId, values, slug);
    router.push(nextHref);
  }

  async function handleAutoSave(formData: FormData) {
    const addressIsUnknown = formData.get("address_unknown") === "true";
    const phoneIsUnknown = formData.get("phone_unknown") === "true";
    const ssnIsUnknown = formData.get("ssn_unknown") === "true";
    const home = phoneIsUnknown ? null : emptyToNull(formData.get("home_phone"));
    const cell = phoneIsUnknown ? null : emptyToNull(formData.get("cell_phone"));
    await saveSingletonSection("party_spouse", caseId, {
      first_name: emptyToNull(formData.get("first_name")),
      middle_name: emptyToNull(formData.get("middle_name")),
      last_name: emptyToNull(formData.get("last_name")),
      date_of_birth: emptyToNull(formData.get("date_of_birth")),
      height: emptyToNull(formData.get("height")),
      weight_lbs: numberOrNull(formData.get("weight_lbs")),
      az_years: numberOrNull(formData.get("az_years")),
      az_months: numberOrNull(formData.get("az_months")),
      address_unknown: addressIsUnknown,
      address_line1: addressIsUnknown ? null : emptyToNull(formData.get("address_line1")),
      address_line2: addressIsUnknown ? null : emptyToNull(formData.get("address_line2")),
      city: addressIsUnknown ? null : emptyToNull(formData.get("city")),
      state: addressIsUnknown ? null : emptyToNull(formData.get("state")),
      zip: addressIsUnknown ? null : emptyToNull(formData.get("zip")),
      phone_unknown: phoneIsUnknown,
      home_phone: home,
      cell_phone: cell,
      phone: cell ?? home,
      email: emptyToNull(formData.get("email")),
      ssn_unknown: ssnIsUnknown,
      ssn_last4: ssnIsUnknown ? null : emptyToNull(formData.get("ssn_last4")),
    });
  }

  return (
    <StepShell
      title="Spouse Information"
      subtitle="Enter what you know. Use the Unknown checkboxes when you do not have that information."
      backHref={backHref}
      backLabel={backLabel}
      submitLabel={submitLabel}
      onSubmit={handleSubmit}
      onAutoSave={handleAutoSave}
    >
      <div className="grid gap-6 sm:grid-cols-3">
        <Field label="First name">
          <TextInput name="first_name" defaultValue={initial.first_name} required />
        </Field>
        <Field label="Middle name">
          <TextInput name="middle_name" defaultValue={initial.middle_name} />
        </Field>
        <Field label="Last name">
          <TextInput name="last_name" defaultValue={initial.last_name} required />
        </Field>
      </div>

      <Field label="Date of birth">
        <TextInput name="date_of_birth" type="date" defaultValue={initial.date_of_birth} required />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Height" hint="Example: 5'8&quot; or 68 in.">
          <TextInput name="height" defaultValue={initial.height} placeholder='e.g. 5&apos;8"' />
        </Field>
        <Field label="Weight" hint="Pounds (lbs).">
          <NumberInput name="weight_lbs" defaultValue={initial.weight_lbs} min={0} step="0.1" />
        </Field>
      </div>

      <div>
        <p className="field-label">How long has your spouse lived in Arizona?</p>
        <div className="mt-2 grid gap-6 sm:grid-cols-2">
          <Field label="Years">
            <NumberInput name="az_years" defaultValue={initial.az_years} min={0} step="1" />
          </Field>
          <Field label="Months">
            <NumberInput name="az_months" defaultValue={initial.az_months} min={0} step="1" />
          </Field>
        </div>
      </div>

      <Checkbox
        name="address_unknown"
        label="I do not know my spouse's current address."
        checked={addressUnknown}
        onChange={setAddressUnknown}
      />

      {!addressUnknown ? (
        <>
          <Field label="Street address">
            <TextInput name="address_line1" defaultValue={initial.address_line1} required />
          </Field>
          <Field label="Apartment / unit">
            <TextInput name="address_line2" defaultValue={initial.address_line2} placeholder="Optional" />
          </Field>
          <div className="grid gap-6 sm:grid-cols-3">
            <Field label="City">
              <TextInput name="city" defaultValue={initial.city} required />
            </Field>
            <Field label="State">
              <TextInput name="state" defaultValue={initial.state} required />
            </Field>
            <Field label="ZIP">
              <TextInput name="zip" defaultValue={initial.zip} required />
            </Field>
          </div>
        </>
      ) : null}

      <Checkbox
        name="phone_unknown"
        label="Phone numbers unknown"
        checked={phoneUnknown}
        onChange={setPhoneUnknown}
      />

      {!phoneUnknown ? (
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Home phone">
            <TextInput name="home_phone" type="tel" defaultValue={initial.home_phone ?? initial.phone} />
          </Field>
          <Field label="Cell phone">
            <TextInput name="cell_phone" type="tel" defaultValue={initial.cell_phone} required />
          </Field>
        </div>
      ) : null}

      <Field label="Email">
        <TextInput name="email" type="email" defaultValue={initial.email} />
      </Field>

      <Checkbox
        name="ssn_unknown"
        label="Social Security number unknown"
        checked={ssnUnknown}
        onChange={setSsnUnknown}
      />

      {!ssnUnknown ? (
        <Field label="Social Security number (last 4 digits)" hint="Exactly 4 digits.">
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
      ) : null}
    </StepShell>
  );
}
