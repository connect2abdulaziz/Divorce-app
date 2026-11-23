"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveSingletonSection } from "@/lib/questionnaire/actions";
import {
  BirthDateInput,
  Checkbox,
  Field,
  NumberInput,
  Select,
  TextInput,
  YesNo,
} from "@/components/questionnaire/fields";
import { StepShell } from "@/components/questionnaire/StepShell";

export type PartyClient = {
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  gender: string | null;
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
  ssn_unknown: boolean | null;
  driver_license_last4: string | null;
  driver_license_unknown: boolean | null;
  court_texts_opt_in: boolean | null;
  interpreter_needed: boolean | null;
  interpreter_language: string | null;
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
  const [error, setError] = useState<string | null>(null);
  const [courtTexts, setCourtTexts] = useState<boolean | null>(initial.court_texts_opt_in);
  const [interpreterNeeded, setInterpreterNeeded] = useState<boolean | null>(
    initial.interpreter_needed
  );
  const [ssnUnknown, setSsnUnknown] = useState(Boolean(initial.ssn_unknown));
  const [dlUnknown, setDlUnknown] = useState(Boolean(initial.driver_license_unknown));

  function buildValues(formData: FormData) {
    const home = emptyToNull(formData.get("home_phone"));
    const cell = emptyToNull(formData.get("cell_phone"));
    const ssnIsUnknown = formData.get("ssn_unknown") === "true";
    const dlIsUnknown = formData.get("driver_license_unknown") === "true";
    return {
      first_name: emptyToNull(formData.get("first_name")),
      middle_name: emptyToNull(formData.get("middle_name")),
      last_name: emptyToNull(formData.get("last_name")),
      date_of_birth: emptyToNull(formData.get("date_of_birth")),
      gender: emptyToNull(formData.get("gender")),
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
      ssn_unknown: ssnIsUnknown,
      ssn_last4: ssnIsUnknown ? null : emptyToNull(formData.get("ssn_last4")),
      driver_license_unknown: dlIsUnknown,
      driver_license_last4: dlIsUnknown
        ? null
        : emptyToNull(formData.get("driver_license_last4")),
      court_texts_opt_in: courtTexts,
      interpreter_needed: interpreterNeeded,
      interpreter_language:
        interpreterNeeded === true
          ? emptyToNull(formData.get("interpreter_language"))
          : null,
    };
  }

  async function handleSubmit(formData: FormData) {
    if (courtTexts === null) {
      setError("Please answer whether you want court text notices.");
      return;
    }
    if (interpreterNeeded === null) {
      setError("Please answer whether you need an interpreter.");
      return;
    }
    if (interpreterNeeded === true && !emptyToNull(formData.get("interpreter_language"))) {
      setError("Please enter the language for the interpreter.");
      return;
    }
    const ssnIsUnknown = formData.get("ssn_unknown") === "true";
    if (!ssnIsUnknown && !emptyToNull(formData.get("ssn_last4"))) {
      setError("Enter the last 4 digits of your Social Security number, or mark it unavailable.");
      return;
    }
    const dlIsUnknown = formData.get("driver_license_unknown") === "true";
    if (!dlIsUnknown && !emptyToNull(formData.get("driver_license_last4"))) {
      setError("Enter the last 4 digits of your driver's license, or mark it unavailable.");
      return;
    }
    setError(null);
    await saveSingletonSection("party_client", caseId, buildValues(formData), slug);
    router.push(nextHref);
  }

  async function handleAutoSave(formData: FormData) {
    await saveSingletonSection("party_client", caseId, buildValues(formData));
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
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}
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

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Date of birth">
          <BirthDateInput name="date_of_birth" defaultValue={initial.date_of_birth} required />
        </Field>
        <Field label="Gender">
          <Select
            name="gender"
            defaultValue={initial.gender}
            required
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
          />
        </Field>
      </div>

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
            defaultValue={initial.home_phone}
            autoComplete="tel"
          />
        </Field>
        <Field label="Cell phone">
          <TextInput name="cell_phone" type="tel" defaultValue={initial.cell_phone} required />
        </Field>
      </div>

      <div>
        <p className="field-label">
          Receive texts from the court at the contact phone number above?
        </p>
        <YesNo name="court_texts_opt_in" value={courtTexts} onChange={setCourtTexts} />
      </div>

      <Field label="Email">
        <TextInput name="email" type="email" defaultValue={initial.email} required autoComplete="email" />
      </Field>

      <Checkbox
        name="ssn_unknown"
        label="I do not have / prefer not to provide my Social Security number last 4"
        checked={ssnUnknown}
        onChange={setSsnUnknown}
      />

      {!ssnUnknown ? (
        <Field
          label="Social Security number (last 4 digits)"
          hint="Used on the Sensitive Data Sheet (and related family-law forms). Exactly 4 digits."
        >
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
      ) : (
        <p className="text-sm text-muted">
          Related SSN fields on court forms will be left blank. You can add this later if the court
          requires it.
        </p>
      )}

      <Checkbox
        name="driver_license_unknown"
        label="I do not have an Arizona driver's license / last 4 unavailable"
        checked={dlUnknown}
        onChange={setDlUnknown}
      />

      {!dlUnknown ? (
        <Field
          label="Driver's license (last 4 digits)"
          hint="Used on the Preliminary Injunction (DR14) party description. Exactly 4 digits."
        >
          <TextInput
            name="driver_license_last4"
            defaultValue={initial.driver_license_last4}
            required
            maxLength={4}
            pattern="[0-9]{4}"
            inputMode="numeric"
            placeholder="####"
            autoComplete="off"
          />
        </Field>
      ) : (
        <p className="text-sm text-muted">
          The Preliminary Injunction license field will be left blank. You can update this later if
          you obtain a license number.
        </p>
      )}

      <div>
        <p className="field-label">Do you need a court interpreter?</p>
        <YesNo
          name="interpreter_needed"
          value={interpreterNeeded}
          onChange={setInterpreterNeeded}
        />
      </div>

      {interpreterNeeded === true ? (
        <Field label="What language?">
          <TextInput
            name="interpreter_language"
            defaultValue={initial.interpreter_language}
            required
            placeholder="e.g. Spanish"
          />
        </Field>
      ) : null}
    </StepShell>
  );
}
