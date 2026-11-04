"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveSingletonSection, updateCaseGates } from "@/lib/questionnaire/actions";
import { Field, Select, TextInput, YesNo } from "@/components/questionnaire/fields";
import { StepShell } from "@/components/questionnaire/StepShell";

export type Marriage = {
  marriage_date: string | null;
  separation_date: string | null;
  marriage_location: string | null;
  marriage_city: string | null;
  marriage_state: string | null;
  grounds: string | null;
  due_date: string | null;
  restore_former_name: boolean | null;
  restored_first_name: string | null;
  restored_middle_name: string | null;
  restored_last_name: string | null;
  spouse_is_father: boolean | null;
  is_covenant_marriage: boolean | null;
  conciliation_attempted: boolean | null;
  spousal_maintenance_requested: boolean | null;
  spousal_maintenance_for: string | null;
  has_written_agreement: boolean | null;
};

function emptyToNull(value: FormDataEntryValue | null) {
  const s = String(value ?? "").trim();
  return s === "" ? null : s;
}

export function MarriageForm({
  caseId,
  slug,
  backHref,
  backLabel,
  nextHref,
  submitLabel,
  initial,
  initialPregnant,
}: {
  caseId: string;
  slug: string;
  backHref: string | null;
  backLabel?: string;
  nextHref: string;
  submitLabel?: string;
  initial: Marriage;
  initialPregnant: boolean | null;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pregnant, setPregnant] = useState<boolean | null>(initialPregnant);
  const [spouseIsFather, setSpouseIsFather] = useState<boolean | null>(initial.spouse_is_father);
  const [restoreName, setRestoreName] = useState<boolean | null>(initial.restore_former_name);
  const [covenant, setCovenant] = useState<boolean | null>(initial.is_covenant_marriage);
  const [conciliation, setConciliation] = useState<boolean | null>(initial.conciliation_attempted);
  const [spousalRequested, setSpousalRequested] = useState<boolean | null>(
    initial.spousal_maintenance_requested
  );
  const [spousalFor, setSpousalFor] = useState<string>(initial.spousal_maintenance_for ?? "");
  const [writtenAgreement, setWrittenAgreement] = useState<boolean | null>(
    initial.has_written_agreement
  );

  function buildValues(formData: FormData) {
    const city = emptyToNull(formData.get("marriage_city"));
    const state = emptyToNull(formData.get("marriage_state"));
    const location =
      [city, state].filter(Boolean).join(", ") || emptyToNull(formData.get("marriage_location"));

    return {
      marriage_date: emptyToNull(formData.get("marriage_date")),
      separation_date: emptyToNull(formData.get("separation_date")),
      marriage_city: city,
      marriage_state: state,
      marriage_location: location,
      grounds: emptyToNull(formData.get("grounds")),
      due_date: pregnant ? emptyToNull(formData.get("due_date")) : null,
      spouse_is_father: pregnant ? spouseIsFather : null,
      restore_former_name: restoreName,
      restored_first_name: restoreName ? emptyToNull(formData.get("restored_first_name")) : null,
      restored_middle_name: restoreName ? emptyToNull(formData.get("restored_middle_name")) : null,
      restored_last_name: restoreName ? emptyToNull(formData.get("restored_last_name")) : null,
      is_covenant_marriage: covenant,
      conciliation_attempted: conciliation,
      spousal_maintenance_requested: spousalRequested,
      spousal_maintenance_for:
        spousalRequested === true
          ? emptyToNull(formData.get("spousal_maintenance_for")) || spousalFor || null
          : null,
      has_written_agreement: writtenAgreement,
    };
  }

  async function handleSubmit(formData: FormData) {
    if (covenant === null) {
      setError("Please confirm whether this is a covenant marriage.");
      return;
    }
    if (conciliation === null) {
      setError("Please confirm whether conciliation / problem-resolution was attempted.");
      return;
    }
    if (spousalRequested === null) {
      setError("Please answer whether either party is requesting spousal maintenance.");
      return;
    }
    if (spousalRequested === true && !spousalFor) {
      setError("Please select who should receive spousal maintenance.");
      return;
    }
    if (writtenAgreement === null) {
      setError("Please answer whether you and your spouse have a written agreement.");
      return;
    }
    if (restoreName === null) {
      setError("Please answer whether a former name should be restored.");
      return;
    }
    if (pregnant === null) {
      setError("Please answer whether the wife is currently pregnant.");
      return;
    }
    setError(null);
    await updateCaseGates(caseId, { is_spouse_pregnant: pregnant ?? false });
    await saveSingletonSection("marriage", caseId, buildValues(formData), slug);
    router.push(nextHref);
  }

  async function handleAutoSave(formData: FormData) {
    await saveSingletonSection("marriage", caseId, buildValues(formData));
  }

  return (
    <StepShell
      title="Marriage & Separation"
      backHref={backHref}
      backLabel={backLabel}
      submitLabel={submitLabel}
      onSubmit={handleSubmit}
      onAutoSave={handleAutoSave}
    >
      {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Date of marriage">
          <TextInput name="marriage_date" type="date" defaultValue={initial.marriage_date} required />
        </Field>
        <Field label="Date of separation" hint="Leave blank if you have not separated yet.">
          <TextInput name="separation_date" type="date" defaultValue={initial.separation_date} />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Place of marriage — city">
          <TextInput name="marriage_city" defaultValue={initial.marriage_city} required />
        </Field>
        <Field label="Place of marriage — state">
          <TextInput name="marriage_state" defaultValue={initial.marriage_state} required />
        </Field>
      </div>

      <Field label="Grounds for divorce" hint="Arizona is a no-fault state; most cases say the marriage is irretrievably broken.">
        <TextInput name="grounds" defaultValue={initial.grounds ?? "Marriage is irretrievably broken"} />
      </Field>

      <div>
        <p className="field-label">Is this a covenant marriage?</p>
        <YesNo name="is_covenant_marriage" value={covenant} onChange={setCovenant} />
        <p className="field-hint">
          Most Arizona marriages are not covenant marriages. Confirm from your marriage license if unsure.
        </p>
      </div>

      <div>
        <p className="field-label">
          Have you attempted conciliation or other efforts to resolve problems in the marriage?
        </p>
        <YesNo name="conciliation_attempted" value={conciliation} onChange={setConciliation} />
      </div>

      <div>
        <p className="field-label">Is either party requesting spousal maintenance (alimony)?</p>
        <YesNo
          name="spousal_maintenance_requested"
          value={spousalRequested}
          onChange={setSpousalRequested}
        />
      </div>

      {spousalRequested === true ? (
        <Field label="Who should receive spousal maintenance?">
          <Select
            name="spousal_maintenance_for"
            value={spousalFor}
            onChange={setSpousalFor}
            options={[
              { value: "client", label: "Me (Party A)" },
              { value: "spouse", label: "Spouse (Party B)" },
            ]}
            required
          />
        </Field>
      ) : null}

      <div>
        <p className="field-label">
          Do you and your spouse already have a written agreement about property and debts?
        </p>
        <YesNo
          name="has_written_agreement"
          value={writtenAgreement}
          onChange={setWrittenAgreement}
        />
      </div>

      <div>
        <p className="field-label">Does the wife want her former name restored?</p>
        <YesNo name="restore_former_name" value={restoreName} onChange={setRestoreName} />
      </div>

      {restoreName === true ? (
        <div className="grid gap-6 sm:grid-cols-3">
          <Field label="Restored first name">
            <TextInput name="restored_first_name" defaultValue={initial.restored_first_name} required />
          </Field>
          <Field label="Restored middle name">
            <TextInput name="restored_middle_name" defaultValue={initial.restored_middle_name} />
          </Field>
          <Field label="Restored last name">
            <TextInput name="restored_last_name" defaultValue={initial.restored_last_name} required />
          </Field>
        </div>
      ) : null}

      <div>
        <p className="field-label">Is the wife currently pregnant?</p>
        <YesNo name="is_spouse_pregnant" value={pregnant} onChange={setPregnant} />
      </div>

      {pregnant === true ? (
        <>
          <div>
            <p className="field-label">Is the spouse the father?</p>
            <YesNo name="spouse_is_father" value={spouseIsFather} onChange={setSpouseIsFather} />
          </div>
          <Field label="Expected due date">
            <TextInput name="due_date" type="date" defaultValue={initial.due_date} />
          </Field>
        </>
      ) : null}
    </StepShell>
  );
}
