"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { saveSingletonSection } from "@/lib/questionnaire/actions";
import {
  BirthDateInput,
  Checkbox,
  Field,
  NumberInput,
  Select,
  TextInput,
  YesNo,
  FormDependent,
} from "@/components/questionnaire/fields";
import { FormNotice } from "@/components/questionnaire/FormNotice";
import { FormSection } from "@/components/questionnaire/FormSection";
import { QuestionBlock } from "@/components/questionnaire/QuestionBlock";
import { StepShell } from "@/components/questionnaire/StepShell";

export type PartySpouse = {
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
  driver_license_last4: string | null;
  driver_license_unknown: boolean | null;
  court_texts_opt_in: boolean | null;
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
  const [error, setError] = useState<string | null>(null);
  const [addressUnknown, setAddressUnknown] = useState(Boolean(initial.address_unknown));
  const [phoneUnknown, setPhoneUnknown] = useState(Boolean(initial.phone_unknown));
  const [ssnUnknown, setSsnUnknown] = useState(Boolean(initial.ssn_unknown));
  const [dlUnknown, setDlUnknown] = useState(Boolean(initial.driver_license_unknown));
  const [courtTexts, setCourtTexts] = useState<boolean | null>(
    initial.phone_unknown ? null : initial.court_texts_opt_in
  );

  useEffect(() => {
    if (phoneUnknown) setCourtTexts(null);
  }, [phoneUnknown]);

  function buildValues(formData: FormData) {
    const addressIsUnknown = formData.get("address_unknown") === "true";
    const phoneIsUnknown = formData.get("phone_unknown") === "true";
    const ssnIsUnknown = formData.get("ssn_unknown") === "true";
    const dlIsUnknown = formData.get("driver_license_unknown") === "true";
    const home = phoneIsUnknown ? null : emptyToNull(formData.get("home_phone"));
    const cell = phoneIsUnknown ? null : emptyToNull(formData.get("cell_phone"));
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
      driver_license_unknown: dlIsUnknown,
      driver_license_last4: dlIsUnknown
        ? null
        : emptyToNull(formData.get("driver_license_last4")),
      court_texts_opt_in: phoneIsUnknown ? null : courtTexts,
    };
  }

  async function handleSubmit(formData: FormData) {
    const phoneIsUnknown = formData.get("phone_unknown") === "true";
    if (!phoneIsUnknown && courtTexts === null) {
      setError("Please answer whether your spouse should receive court text notices.");
      return;
    }
    const dlIsUnknown = formData.get("driver_license_unknown") === "true";
    if (!dlIsUnknown && !emptyToNull(formData.get("driver_license_last4"))) {
      setError("Enter the last 4 digits of your spouse's driver's license, or mark it unknown.");
      return;
    }
    setError(null);
    await saveSingletonSection("party_spouse", caseId, buildValues(formData), slug);
    router.push(nextHref);
  }

  async function handleAutoSave(formData: FormData) {
    await saveSingletonSection("party_spouse", caseId, buildValues(formData));
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
      {error ? <FormNotice variant="error">{error}</FormNotice> : null}

      <FormSection title="Personal details">
        <div className="ldd-q-grid ldd-q-grid--3">
          <Field label="First name" htmlFor="first_name" required>
            <TextInput name="first_name" defaultValue={initial.first_name} required />
          </Field>
          <Field label="Middle name" htmlFor="middle_name" optional>
            <TextInput name="middle_name" defaultValue={initial.middle_name} />
          </Field>
          <Field label="Last name" htmlFor="last_name" required>
            <TextInput name="last_name" defaultValue={initial.last_name} required />
          </Field>
        </div>

        <div className="ldd-q-grid ldd-q-grid--2">
          <Field label="Date of birth" htmlFor="date_of_birth" required>
            <BirthDateInput name="date_of_birth" defaultValue={initial.date_of_birth} required />
          </Field>
          <Field label="Gender" htmlFor="gender" optional>
            <Select
              name="gender"
              defaultValue={initial.gender}
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
            />
          </Field>
        </div>

        <div className="ldd-q-grid ldd-q-grid--2">
          <Field label="Height" htmlFor="height" optional hint="Example: 5'8&quot; or 68 in.">
            <TextInput name="height" defaultValue={initial.height} placeholder='e.g. 5&apos;8"' />
          </Field>
          <Field label="Weight" htmlFor="weight" optional hint="Pounds (lbs).">
            <NumberInput name="weight_lbs" defaultValue={initial.weight_lbs} min={0} step="0.1" />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Arizona residency">
        <QuestionBlock>How long has your spouse lived in Arizona?</QuestionBlock>
        <div className="ldd-q-grid ldd-q-grid--2">
          <Field label="Years" htmlFor="az_years" optional>
            <NumberInput name="az_years" defaultValue={initial.az_years} min={0} step="1" />
          </Field>
          <Field label="Months" htmlFor="az_months" optional>
            <NumberInput name="az_months" defaultValue={initial.az_months} min={0} step="1" />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Address information">
        <Checkbox
          name="address_unknown"
          label="I do not know my spouse's current address."
          checked={addressUnknown}
          onChange={setAddressUnknown}
        />

        {!addressUnknown ? (
          <FormDependent>
            <Field label="Street address" htmlFor="address_line1" required>
              <TextInput name="address_line1" defaultValue={initial.address_line1} required />
            </Field>
            <Field label="Apartment / unit" htmlFor="address_line2" optional>
              <TextInput name="address_line2" defaultValue={initial.address_line2} placeholder="Optional" />
            </Field>
            <div className="ldd-q-grid ldd-q-grid--3">
              <Field label="City" htmlFor="city" required>
                <TextInput name="city" defaultValue={initial.city} required />
              </Field>
              <Field label="State" htmlFor="state" required>
                <TextInput name="state" defaultValue={initial.state} required />
              </Field>
              <Field label="ZIP" htmlFor="zip" required>
                <TextInput name="zip" defaultValue={initial.zip} required />
              </Field>
            </div>
          </FormDependent>
        ) : null}
      </FormSection>

      <FormSection title="Contact information">
        <Checkbox
          name="phone_unknown"
          label="Phone numbers unknown"
          checked={phoneUnknown}
          onChange={setPhoneUnknown}
        />

        {!phoneUnknown ? (
          <FormDependent>
            <div className="ldd-q-grid ldd-q-grid--2">
              <Field label="Home phone" htmlFor="home_phone" optional>
                <TextInput name="home_phone" type="tel" defaultValue={initial.home_phone} />
              </Field>
              <Field label="Cell phone" htmlFor="cell_phone" required>
                <TextInput name="cell_phone" type="tel" defaultValue={initial.cell_phone} required />
              </Field>
            </div>

            <div>
              <QuestionBlock required>
                Receive texts from the court at your spouse&apos;s contact phone number?
              </QuestionBlock>
              <YesNo name="court_texts_opt_in" value={courtTexts} onChange={setCourtTexts} />
            </div>
          </FormDependent>
        ) : null}

        <Field label="Email" htmlFor="email" optional>
          <TextInput name="email" type="email" defaultValue={initial.email} />
        </Field>
      </FormSection>

      <FormSection title="Identification">
        <Checkbox
          name="ssn_unknown"
          label="Social Security number unknown"
          checked={ssnUnknown}
          onChange={setSsnUnknown}
        />

        {!ssnUnknown ? (
          <FormDependent>
            <Field label="Social Security number (last 4 digits)" htmlFor="ssn_last4" required hint="Exactly 4 digits.">
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
          </FormDependent>
        ) : null}

        <Checkbox
          name="driver_license_unknown"
          label="Driver's license unknown"
          checked={dlUnknown}
          onChange={setDlUnknown}
        />

        {!dlUnknown ? (
          <FormDependent>
            <Field label="Driver's license (last 4 digits)" htmlFor="driver_license_last4" required hint="Exactly 4 digits.">
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
          </FormDependent>
        ) : null}
      </FormSection>
    </StepShell>
  );
}
