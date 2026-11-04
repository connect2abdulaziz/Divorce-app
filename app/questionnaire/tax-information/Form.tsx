"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveSingletonSection } from "@/lib/questionnaire/actions";
import { Field, Select, TextArea } from "@/components/questionnaire/fields";
import { StepShell } from "@/components/questionnaire/StepShell";

type TaxInformation = {
  filing_status?: string | null;
  dependents_claimed_by: string | null;
  claim_frequency: string | null;
  even_year_claimant?: string | null;
  going_forward_filing?: string | null;
  previous_years_filing?: string | null;
  notes: string | null;
};

function emptyToNull(value: FormDataEntryValue | null) {
  const s = String(value ?? "").trim();
  return s === "" ? null : s;
}

function normalizeClaimedBy(value: string | null) {
  if (value === "client" || value === "spouse" || value === "split") return value;
  return null;
}

function normalizeFrequency(value: string | null, claimedBy: string | null) {
  if (value === "every_year" || value === "alternate_years") return value;
  if (claimedBy === "alternate" || claimedBy === "split") return "alternate_years";
  return null;
}

export function TaxInformationForm({
  caseId,
  slug,
  backHref,
  backLabel,
  nextHref,
  submitLabel,
  initial,
  hasCommonChildren,
}: {
  caseId: string;
  slug: string;
  backHref: string | null;
  backLabel?: string;
  nextHref: string;
  submitLabel?: string;
  initial: TaxInformation | null;
  hasCommonChildren: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const claimedDefault = normalizeClaimedBy(initial?.dependents_claimed_by ?? null);
  const frequencyDefault = normalizeFrequency(
    initial?.claim_frequency ?? null,
    initial?.dependents_claimed_by ?? null
  );
  const [frequency, setFrequency] = useState<string>(frequencyDefault ?? "");
  const [claimedBy, setClaimedBy] = useState<string>(
    claimedDefault === "split" ? "" : claimedDefault ?? ""
  );
  const [evenYear, setEvenYear] = useState<string>(initial?.even_year_claimant ?? "");
  const [goingForward, setGoingForward] = useState<string>(
    initial?.going_forward_filing ?? initial?.filing_status ?? ""
  );
  const [previousYears, setPreviousYears] = useState<string>(
    initial?.previous_years_filing ?? ""
  );

  function buildValues(formData: FormData) {
    const freq = emptyToNull(formData.get("claim_frequency")) || frequency || null;
    const even = emptyToNull(formData.get("even_year_claimant")) || evenYear || null;
    const who =
      freq === "alternate_years"
        ? "split"
        : emptyToNull(formData.get("dependents_claimed_by")) || claimedBy || null;
    const forward =
      emptyToNull(formData.get("going_forward_filing")) || goingForward || null;
    const previous =
      emptyToNull(formData.get("previous_years_filing")) || previousYears || null;
    return {
      dependents_claimed_by: hasCommonChildren ? who : null,
      claim_frequency: hasCommonChildren ? freq : null,
      even_year_claimant: hasCommonChildren && freq === "alternate_years" ? even : null,
      going_forward_filing: forward,
      previous_years_filing: previous,
      filing_status: forward,
      notes: emptyToNull(formData.get("notes")),
    };
  }

  async function handleSubmit(formData: FormData) {
    const forward = emptyToNull(formData.get("going_forward_filing")) || goingForward;
    const previous = emptyToNull(formData.get("previous_years_filing")) || previousYears;
    if (!forward) {
      setError("Please select how you will file tax returns going forward.");
      return;
    }
    if (!previous) {
      setError("Please select how prior-year tax returns will be handled.");
      return;
    }
    if (hasCommonChildren) {
      const freq = emptyToNull(formData.get("claim_frequency")) || frequency;
      if (!freq) {
        setError("Please select how often the dependents will be claimed.");
        return;
      }
      if (freq === "every_year" && !(emptyToNull(formData.get("dependents_claimed_by")) || claimedBy)) {
        setError("Please select who will claim the dependents.");
        return;
      }
      if (
        freq === "alternate_years" &&
        !(emptyToNull(formData.get("even_year_claimant")) || evenYear)
      ) {
        setError("Please select who claims the children in even-numbered years.");
        return;
      }
    }
    setError(null);
    await saveSingletonSection("tax_information", caseId, buildValues(formData), slug);
    router.push(nextHref);
  }

  async function handleAutoSave(formData: FormData) {
    await saveSingletonSection("tax_information", caseId, buildValues(formData));
  }

  return (
    <StepShell
      title="Tax Information"
      subtitle={
        hasCommonChildren
          ? "How will you file tax returns, and who will claim the children as dependents?"
          : "How will you and your spouse file federal and state tax returns?"
      }
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

      <Field
        label="Going forward after the divorce"
        hint="Most petitions ask the court to order separate returns going forward."
      >
        <Select
          name="going_forward_filing"
          value={goingForward}
          onChange={setGoingForward}
          options={[
            { value: "separate", label: "File separate federal and state returns" },
            { value: "joint", label: "Continue filing jointly (unusual after divorce)" },
          ]}
          required
        />
      </Field>

      <Field label="For previous tax years (still open / not yet filed)">
        <Select
          name="previous_years_filing"
          value={previousYears}
          onChange={setPreviousYears}
          options={[
            { value: "joint", label: "File joint federal and state returns" },
            { value: "separate", label: "File separate federal and state returns" },
            { value: "not_applicable", label: "Not applicable / already filed" },
          ]}
          required
        />
      </Field>

      {hasCommonChildren ? (
        <>
          <Field label="How often will dependents be claimed?">
            <Select
              name="claim_frequency"
              value={frequency}
              onChange={setFrequency}
              options={[
                { value: "every_year", label: "Every year (same parent)" },
                { value: "alternate_years", label: "Alternate years (odd / even)" },
              ]}
              required
            />
          </Field>

          {frequency === "every_year" ? (
            <Field label="Who will claim the dependents every year?">
              <Select
                name="dependents_claimed_by"
                value={claimedBy}
                onChange={setClaimedBy}
                options={[
                  { value: "client", label: "Me" },
                  { value: "spouse", label: "Spouse" },
                ]}
                required
              />
            </Field>
          ) : null}

          {frequency === "alternate_years" ? (
            <Field
              label="Who claims the children in even-numbered years?"
              hint="The other parent claims them in odd-numbered years."
            >
              <Select
                name="even_year_claimant"
                value={evenYear}
                onChange={setEvenYear}
                options={[
                  { value: "client", label: "Me (even years)" },
                  { value: "spouse", label: "Spouse (even years)" },
                ]}
                required
              />
            </Field>
          ) : null}
        </>
      ) : null}

      <Field label="Additional notes">
        <TextArea name="notes" defaultValue={initial?.notes} rows={3} />
      </Field>
    </StepShell>
  );
}
