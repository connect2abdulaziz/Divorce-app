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
import { TextInput, YesNo } from "@/components/questionnaire/fields";
import { StepFrame } from "@/components/questionnaire/StepFrame";

type Residence = {
  id: string;
  address: string | null;
  start_date: string | null;
  end_date: string | null;
  is_primary_residence: boolean | null;
};

type Child = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  child_residences: Residence[];
};

function ResidenceRow({ residence, caseId }: { residence: Residence; caseId: string }) {
  const [, startTransition] = useTransition();
  return (
    <li className="flex items-center justify-between rounded-xl border border-line bg-[#FBFBF8] px-3 py-2 text-sm">
      <span className="text-ink">
        {residence.address || "Address not entered"}
        {residence.is_primary_residence && <span className="ml-2 text-accent">Primary</span>}
        {(residence.start_date || residence.end_date) && (
          <span className="ml-2 text-muted">
            {residence.start_date ?? "…"} – {residence.end_date ?? "present"}
          </span>
        )}
      </span>
      <button
        type="button"
        className="btn-danger-text"
        onClick={() => startTransition(async () => void (await deleteChildResidence(residence.id)))}
      >
        Remove
      </button>
    </li>
  );
}

function AddResidenceForm({ childId, caseId, onDone }: { childId: string; caseId: string; onDone: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [isPrimary, setIsPrimary] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values = {
      address: fd.get("address") || null,
      start_date: fd.get("start_date") || null,
      end_date: fd.get("end_date") || null,
      is_primary_residence: isPrimary,
    };
    startTransition(async () => {
      await addChildResidence(childId, caseId, values);
      onDone();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-3 rounded-xl border border-line bg-[#F7F6F1] p-4">
      <TextInput name="address" placeholder="Address" />
      <div className="grid grid-cols-2 gap-3">
        <TextInput name="start_date" type="date" />
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
          const values = Object.fromEntries(fd.entries());
          startTransition(async () => {
            await updateRecord("children", child.id, values);
            setEditing(false);
          });
        }}
        className="rounded-xl border border-line bg-[#F7F6F1] p-4"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <TextInput name="first_name" defaultValue={child.first_name} placeholder="First name" required />
          <TextInput name="last_name" defaultValue={child.last_name} placeholder="Last name" required />
          <TextInput name="date_of_birth" type="date" defaultValue={child.date_of_birth} required />
        </div>
        <div className="mt-4 flex gap-3">
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
      <div className="flex items-center justify-between">
        <div>
          <p className="text-ink">
            {child.first_name} {child.last_name}
          </p>
          {child.date_of_birth && <p className="text-sm text-muted">Born {child.date_of_birth}</p>}
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
        <p className="text-sm text-muted">Residence history</p>
        {child.child_residences.length > 0 && (
          <ul className="mt-2 space-y-1.5">
            {child.child_residences.map((r) => (
              <ResidenceRow key={r.id} residence={r} caseId={caseId} />
            ))}
          </ul>
        )}
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
    await updateCaseGates(caseId, { has_common_children: hasChildren ?? false }, slug);
    router.push(nextHref);
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

      {hasChildren === true && (
        <div className="space-y-3">
          {kids.length === 0 && !adding && <p className="text-muted">No children added yet.</p>}

          {kids.map((child) => (
            <ChildCard key={child.id} child={child} caseId={caseId} />
          ))}

          {adding ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const values = Object.fromEntries(fd.entries());
                startTransition(async () => {
                  await addRecord("children", caseId, values);
                  setAdding(false);
                });
              }}
              className="rounded-xl border border-line bg-[#F7F6F1] p-4"
            >
              <div className="grid gap-4 sm:grid-cols-3">
                <TextInput name="first_name" placeholder="First name" required />
                <TextInput name="last_name" placeholder="Last name" required />
                <TextInput name="date_of_birth" type="date" required />
              </div>
              <div className="mt-4 flex gap-3">
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
      )}
    </StepFrame>
  );
}
