"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  addChildResidence,
  addRecord,
  deleteChildResidence,
  deleteRecord,
  updateCaseGates,
  updateRecord,
} from "@/lib/questionnaire/actions";
import { Field, Select, TextInput, YesNo } from "@/components/questionnaire/fields";
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
    <li className="flex items-start justify-between gap-3 rounded-xl border border-line bg-[#FBFBF8] px-3 py-2 text-sm">
      <span className="text-ink">
        {residenceLabel(residence)}
        {residence.is_primary_residence ? <span className="ml-2 text-accent">Primary</span> : null}
        {withLabel ? <span className="ml-2 text-muted">{withLabel}</span> : null}
        {(residence.start_date || residence.end_date) && (
          <span className="ml-2 text-muted">
            {residence.start_date ?? "…"} – {residence.end_date ?? "present"}
          </span>
        )}
      </span>
      <button
        type="button"
        className="btn-danger-text shrink-0"
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
    <form onSubmit={handleSubmit} className="mt-2 space-y-3 rounded-xl border border-line bg-[#F7F6F1] p-4">
      <Field label="Street address">
        <TextInput name="street_address" placeholder="Street address" required />
      </Field>
      <div className="grid gap-3 sm:grid-cols-3">
        <TextInput name="city" placeholder="City" required />
        <TextInput name="state" placeholder="State" required />
        <TextInput name="zip" placeholder="ZIP" required />
      </div>
      <Field label="Child lived with">
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
      <div className="grid grid-cols-2 gap-3">
        <TextInput name="start_date" type="date" required />
        <TextInput name="end_date" type="date" />
      </div>
      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" checked={isPrimary} onChange={(e) => setIsPrimary(e.target.checked)} />
        Primary residence
      </label>
      <div className="flex gap-3">
        <button type="submit" className="btn-primary" disabled={isPending}>
          {isPending ? "Saving…" : "Add residence"}
        </button>
        <button type="button" className="btn-secondary" onClick={onDone} disabled={isPending}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function ChildCard({ child, caseId }: { child: Child; caseId: string }) {
  const [editing, setEditing] = useState(false);
  const [addingResidence, setAddingResidence] = useState(false);
  const [isPending, startTransition] = useTransition();

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
        className="space-y-4 rounded-xl border border-line bg-[#F7F6F1] p-4"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <TextInput name="first_name" defaultValue={child.first_name} placeholder="First name" required />
          <TextInput name="middle_name" defaultValue={child.middle_name} placeholder="Middle name" />
          <TextInput name="last_name" defaultValue={child.last_name} placeholder="Last name" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput name="date_of_birth" type="date" defaultValue={child.date_of_birth} required />
          <TextInput
            name="ssn_last4"
            defaultValue={child.ssn_last4}
            placeholder="SSN last 4"
            maxLength={4}
            pattern="[0-9]{4}"
            inputMode="numeric"
          />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={isPending}>
            {isPending ? "Saving…" : "Save"}
          </button>
          <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="rounded-xl border border-line bg-[#FBFBF8] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-ink">
            {[child.first_name, child.middle_name, child.last_name].filter(Boolean).join(" ")}
          </p>
          <p className="text-sm text-muted">
            {child.date_of_birth ? `Born ${child.date_of_birth}` : null}
            {child.ssn_last4 ? ` · SSN •••-••-${child.ssn_last4}` : null}
          </p>
        </div>
        <div className="flex gap-4 text-sm">
          <button type="button" className="btn-text" onClick={() => setEditing(true)}>
            Edit
          </button>
          <button
            type="button"
            className="btn-danger-text"
            onClick={() => startTransition(async () => void (await deleteRecord("children", child.id)))}
            disabled={isPending}
          >
            Remove
          </button>
        </div>
      </div>

      <div className="mt-3 border-t border-line pt-3">
        <p className="text-sm text-muted">Residence history (previous five years)</p>
        {child.child_residences.length > 0 ? (
          <ul className="mt-2 space-y-1.5">
            {child.child_residences.map((r) => (
              <ResidenceRow key={r.id} residence={r} caseId={caseId} />
            ))}
          </ul>
        ) : null}
        {addingResidence ? (
          <AddResidenceForm childId={child.id} caseId={caseId} onDone={() => setAddingResidence(false)} />
        ) : (
          <button type="button" className="btn-text mt-2 text-sm" onClick={() => setAddingResidence(true)}>
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
  const [isPending, startTransition] = useTransition();

  async function handleContinue() {
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
    >
      <div>
        <p className="field-label">Do you and your spouse have any children together?</p>
        <YesNo name="has_common_children" value={hasChildren} onChange={setHasChildren} />
      </div>

      {hasChildren === true ? (
        <div className="space-y-3">
          {kids.length === 0 && !adding ? <p className="text-muted">No children added yet.</p> : null}

          {kids.map((child) => (
            <ChildCard key={child.id} child={child} caseId={caseId} />
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
              className="space-y-4 rounded-xl border border-line bg-[#F7F6F1] p-4"
            >
              <div className="grid gap-4 sm:grid-cols-3">
                <TextInput name="first_name" placeholder="First name" required />
                <TextInput name="middle_name" placeholder="Middle name" />
                <TextInput name="last_name" placeholder="Last name" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput name="date_of_birth" type="date" required />
                <TextInput
                  name="ssn_last4"
                  placeholder="SSN last 4"
                  maxLength={4}
                  pattern="[0-9]{4}"
                  inputMode="numeric"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary" disabled={isPending}>
                  {isPending ? "Saving…" : "Add child"}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setAdding(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button type="button" className="btn-secondary" onClick={() => setAdding(true)}>
              + Add another child
            </button>
          )}
        </div>
      ) : null}
    </StepFrame>
  );
}
