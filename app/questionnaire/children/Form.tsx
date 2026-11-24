"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import {
  addChildResidence,
  addRecord,
  deleteChildResidence,
  deleteRecord,
  updateCaseGates,
  updateRecord,
} from "@/lib/questionnaire/actions";
import { BirthDateInput, Field, Select, TextInput, YesNo } from "@/components/questionnaire/fields";
import { QuestionBlock } from "@/components/questionnaire/QuestionBlock";
import { StepFrame } from "@/components/questionnaire/StepFrame";

type Residence = {
  id: string;
  address: string | null;
  street_address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  lived_with: string | null;
  start_date: string | null;
  end_date: string | null;
  is_primary_residence: boolean | null;
};

type Child = {
  id: string;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  ssn_last4: string | null;
  child_residences: Residence[];
};

function livedWithLabel(value: string | null) {
  if (value === "client") return "Lived with me";
  if (value === "spouse") return "Lived with spouse";
  if (value === "both") return "Lived with both";
  if (value === "other") return "Other";
  return null;
}

function residenceLabel(r: Residence) {
  const parts = [r.street_address || r.address, r.city, r.state, r.zip].filter(Boolean);
  return parts.join(", ") || "Address not entered";
}

function emptyToNull(value: FormDataEntryValue | null) {
  const s = String(value ?? "").trim();
  return s === "" ? null : s;
}

function ResidenceRow({ residence }: { residence: Residence; caseId: string }) {
  const [, startTransition] = useTransition();
  const withLabel = livedWithLabel(residence.lived_with);
  return (
    <li className="ldd-q-repeat__item">
      <div>
        <p className="ldd-q-repeat__title">
          {residenceLabel(residence)}
          {residence.is_primary_residence ? <span className="ml-2 text-accent">Primary</span> : null}
        </p>
        <p className="ldd-q-repeat__detail">
          {withLabel ? withLabel : null}
          {(residence.start_date || residence.end_date) && (
            <span>
              {withLabel ? " · " : ""}
              {residence.start_date ?? "…"} – {residence.end_date ?? "present"}
            </span>
          )}
        </p>
      </div>
      <button
        type="button"
        className="ldd-q-btn ldd-q-btn--danger"
        onClick={() => startTransition(async () => void (await deleteChildResidence(residence.id)))}
      >
        Remove
      </button>
    </li>
  );
}

function AddResidenceForm({
  childId,
  caseId,
  onDone,
}: {
  childId: string;
  caseId: string;
  onDone: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [isPrimary, setIsPrimary] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const street = emptyToNull(fd.get("street_address"));
    const city = emptyToNull(fd.get("city"));
    const state = emptyToNull(fd.get("state"));
    const zip = emptyToNull(fd.get("zip"));
    const values = {
      street_address: street,
      city,
      state,
      zip,
      address: [street, city, state, zip].filter(Boolean).join(", ") || null,
      lived_with: emptyToNull(fd.get("lived_with")),
      start_date: emptyToNull(fd.get("start_date")),
      end_date: emptyToNull(fd.get("end_date")),
      is_primary_residence: isPrimary,
    };
    startTransition(async () => {
      await addChildResidence(childId, caseId, values);
      onDone();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="ldd-q-record-form mt-2">
      <p className="ldd-q-record-form__title">Add residence</p>
      <Field label="Street address" htmlFor="street_address" required>
        <TextInput name="street_address" placeholder="Street address" required />
      </Field>
      <div className="ldd-q-grid ldd-q-grid--3">
        <TextInput name="city" placeholder="City" required />
        <TextInput name="state" placeholder="State" required />
        <TextInput name="zip" placeholder="ZIP" required />
      </div>
      <Field label="Child lived with" htmlFor="lived_with" required>
        <Select
          name="lived_with"
          options={[
            { value: "client", label: "Me" },
            { value: "spouse", label: "Spouse" },
            { value: "both", label: "Both" },
            { value: "other", label: "Other" },
          ]}
          required
        />
      </Field>
      <div className="ldd-q-grid ldd-q-grid--2">
        <TextInput name="start_date" type="date" required />
        <TextInput name="end_date" type="date" />
      </div>
      <label className="ldd-q-checkbox">
        <input
          type="checkbox"
          className="ldd-q-checkbox__input"
          checked={isPrimary}
          onChange={(e) => setIsPrimary(e.target.checked)}
        />
        <span className="ldd-q-checkbox__label">Primary residence</span>
      </label>
      <div className="ldd-q-record-form__actions">
        <button type="submit" className="ldd-q-btn ldd-q-btn--primary" disabled={isPending}>
          {isPending ? "Saving…" : "Add residence"}
        </button>
        <button type="button" className="ldd-q-btn ldd-q-btn--secondary" onClick={onDone} disabled={isPending}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function ChildCard({
  child,
  caseId,
  onDirtyChange,
}: {
  child: Child;
  caseId: string;
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [addingResidence, setAddingResidence] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    onDirtyChange?.(editing || addingResidence);
    return () => onDirtyChange?.(false);
  }, [editing, addingResidence, onDirtyChange]);

  if (editing) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const values = {
            first_name: emptyToNull(fd.get("first_name")),
            middle_name: emptyToNull(fd.get("middle_name")),
            last_name: emptyToNull(fd.get("last_name")),
            date_of_birth: emptyToNull(fd.get("date_of_birth")),
            ssn_last4: emptyToNull(fd.get("ssn_last4")),
          };
          startTransition(async () => {
            await updateRecord("children", child.id, values);
            setEditing(false);
          });
        }}
        className="ldd-q-record-form"
      >
        <p className="ldd-q-record-form__title">Edit child</p>
        <div className="ldd-q-grid ldd-q-grid--3">
          <TextInput name="first_name" defaultValue={child.first_name} placeholder="First name" required />
          <TextInput name="middle_name" defaultValue={child.middle_name} placeholder="Middle name" />
          <TextInput name="last_name" defaultValue={child.last_name} placeholder="Last name" required />
        </div>
        <div className="ldd-q-grid ldd-q-grid--2">
          <BirthDateInput name="date_of_birth" defaultValue={child.date_of_birth} required />
          <TextInput
            name="ssn_last4"
            defaultValue={child.ssn_last4}
            placeholder="SSN last 4 (optional)"
            maxLength={4}
            pattern="[0-9]{4}"
            inputMode="numeric"
          />
        </div>
        <div className="ldd-q-record-form__actions">
          <button type="submit" className="ldd-q-btn ldd-q-btn--primary" disabled={isPending}>
            {isPending ? "Saving…" : "Save"}
          </button>
          <button type="button" className="ldd-q-btn ldd-q-btn--secondary" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="ldd-q-repeat__item ldd-q-repeat__item--column ldd-q-grid__full">
      <div className="flex items-center justify-between gap-3 w-full">
        <div>
          <p className="ldd-q-repeat__title">
            {[child.first_name, child.middle_name, child.last_name].filter(Boolean).join(" ")}
          </p>
          <p className="ldd-q-repeat__detail">
            {child.date_of_birth ? `Born ${child.date_of_birth}` : null}
            {child.ssn_last4 ? ` · SSN •••-••-${child.ssn_last4}` : null}
          </p>
        </div>
        <div className="ldd-q-repeat__actions">
          <button type="button" className="ldd-q-btn ldd-q-btn--text" onClick={() => setEditing(true)}>
            Edit
          </button>
          <button
            type="button"
            className="ldd-q-btn ldd-q-btn--danger"
            onClick={() => startTransition(async () => void (await deleteRecord("children", child.id)))}
            disabled={isPending}
          >
            Remove
          </button>
        </div>
      </div>

      <div className="mt-3 border-t border-line pt-3 w-full">
        <p className="ldd-q-repeat__detail">Residence history (previous five years)</p>
        {child.child_residences.length > 0 ? (
          <ul className="ldd-q-repeat mt-2">
            {child.child_residences.map((r) => (
              <ResidenceRow key={r.id} residence={r} caseId={caseId} />
            ))}
          </ul>
        ) : null}
        {addingResidence ? (
          <AddResidenceForm childId={child.id} caseId={caseId} onDone={() => setAddingResidence(false)} />
        ) : (
          <button type="button" className="ldd-q-btn ldd-q-btn--text mt-2" onClick={() => setAddingResidence(true)}>
            + Add residence
          </button>
        )}
      </div>
    </div>
  );
}

export function ChildrenForm({
  caseId,
  slug,
  backHref,
  backLabel,
  nextHref,
  submitLabel,
  gateValue,
  kids,
}: {
  caseId: string;
  slug: string;
  backHref: string | null;
  backLabel?: string;
  nextHref: string;
  submitLabel?: string;
  gateValue: boolean | null;
  kids: Child[];
}) {
  const router = useRouter();
  const [hasChildren, setHasChildren] = useState<boolean | null>(gateValue);
  const [adding, setAdding] = useState(false);
  const [dirtyChildIds, setDirtyChildIds] = useState<Set<string>>(() => new Set());
  const [isPending, startTransition] = useTransition();

  const setChildDirty = useCallback((id: string, dirty: boolean) => {
    setDirtyChildIds((prev) => {
      const has = prev.has(id);
      if (dirty === has) return prev;
      const next = new Set(prev);
      if (dirty) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const itemFormOpen = adding || dirtyChildIds.size > 0;

  async function handleContinue() {
    if (itemFormOpen) return;
    const value = hasChildren ?? false;
    await updateCaseGates(caseId, { has_common_children: value }, slug);
    // Pre-answer nextHref skips parenting/tax; Yes opens them.
    if (value && !nextHref.includes("review")) {
      router.push("/questionnaire/parenting");
    } else {
      router.push(nextHref);
    }
  }

  return (
    <StepFrame
      title="Children"
      backHref={backHref}
      backLabel={backLabel}
      continueLabel={submitLabel}
      onContinue={handleContinue}
      continueDisabled={itemFormOpen}
      continueDisabledReason="Click Add child (or Save / Cancel) on the open form first, then Save & continue."
    >
      <QuestionBlock required>Do you and your spouse have any children together?</QuestionBlock>
      <YesNo
        name="has_common_children"
        value={hasChildren}
        onChange={(next) => {
          setHasChildren(next);
          if (next !== true) {
            setAdding(false);
            setDirtyChildIds(new Set());
          }
        }}
      />

      {hasChildren === true ? (
        <div className="ldd-q-repeat">
          {kids.length === 0 && !adding ? <p className="ldd-q-repeat__empty">No children added yet.</p> : null}

          {kids.map((child) => (
            <ChildCard
              key={child.id}
              child={child}
              caseId={caseId}
              onDirtyChange={(dirty) => setChildDirty(child.id, dirty)}
            />
          ))}

          {adding ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const values = {
                  first_name: emptyToNull(fd.get("first_name")),
                  middle_name: emptyToNull(fd.get("middle_name")),
                  last_name: emptyToNull(fd.get("last_name")),
                  date_of_birth: emptyToNull(fd.get("date_of_birth")),
                  ssn_last4: emptyToNull(fd.get("ssn_last4")),
                };
                startTransition(async () => {
                  await addRecord("children", caseId, values);
                  setAdding(false);
                });
              }}
              className="ldd-q-record-form"
            >
              <p className="ldd-q-record-form__title">Add a child</p>
              <div className="ldd-q-grid ldd-q-grid--3">
                <TextInput name="first_name" placeholder="First name" required />
                <TextInput name="middle_name" placeholder="Middle name" />
                <TextInput name="last_name" placeholder="Last name" required />
              </div>
              <div className="ldd-q-grid ldd-q-grid--2">
                <BirthDateInput name="date_of_birth" required />
                <TextInput
                  name="ssn_last4"
                  placeholder="SSN last 4 (optional)"
                  maxLength={4}
                  pattern="[0-9]{4}"
                  inputMode="numeric"
                />
              </div>
              <div className="ldd-q-record-form__actions">
                <button type="submit" className="ldd-q-btn ldd-q-btn--primary" disabled={isPending}>
                  {isPending ? "Saving…" : "Add child"}
                </button>
                <button type="button" className="ldd-q-btn ldd-q-btn--secondary" onClick={() => setAdding(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button type="button" className="ldd-q-btn ldd-q-btn--secondary" onClick={() => setAdding(true)}>
              + Add another child
            </button>
          )}
        </div>
      ) : null}
    </StepFrame>
  );
}
