"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveSingletonSection, updateCaseGates } from "@/lib/questionnaire/actions";
import { Field, TextInput, YesNo } from "@/components/questionnaire/fields";
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
  const [pregnant, setPregnant] = useState<boolean | null>(initialPregnant);
  const [spouseIsFather, setSpouseIsFather] = useState<boolean | null>(initial.spouse_is_father);
  const [restoreName, setRestoreName] = useState<boolean | null>(initial.restore_former_name);

  async function handleSubmit(formData: FormData) {
    const city = emptyToNull(formData.get("marriage_city"));
    const state = emptyToNull(formData.get("marriage_state"));
    const location =
      [city, state].filter(Boolean).join(", ") || emptyToNull(formData.get("marriage_location"));

    const values = {
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
    };

    await updateCaseGates(caseId, { is_spouse_pregnant: pregnant ?? false });
    await saveSingletonSection("marriage", caseId, values, slug);
    router.push(nextHref);
  }

  async function handleAutoSave(formData: FormData) {
    const city = emptyToNull(formData.get("marriage_city"));
    const state = emptyToNull(formData.get("marriage_state"));
    const location =
      [city, state].filter(Boolean).join(", ") || emptyToNull(formData.get("marriage_location"));
    await saveSingletonSection("marriage", caseId, {
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
    });
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
