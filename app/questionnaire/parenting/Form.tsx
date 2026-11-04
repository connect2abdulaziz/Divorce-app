"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveSingletonSection } from "@/lib/questionnaire/actions";
import { Field, NumberInput, Select, TextArea, YesNo } from "@/components/questionnaire/fields";
import { StepShell } from "@/components/questionnaire/StepShell";

export type Parenting = {
  custody_arrangement: string | null;
  decision_making: string | null;
  parenting_time_schedule: string | null;
  visitation_wanted: boolean | null;
  visitation_denied_reason: string | null;
  joint_by_agreement: boolean | null;
  child_support_payer: string | null;
  has_existing_child_support_order: boolean | null;
  has_dui_or_drug_conviction: boolean | null;
  transportation_provider: string | null;
  advance_notice_days: number | null;
  vacation_weeks: number | null;
  vacation_notice_days: number | null;
  summer_schedule_same: boolean | null;
  summer_schedule_notes: string | null;
  notes: string | null;
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

export function ParentingForm({
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
  initial: Parenting;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [visitationWanted, setVisitationWanted] = useState<boolean | null>(initial.visitation_wanted);
  const [custody, setCustody] = useState<string>(
    initial.custody_arrangement === "joint" || initial.custody_arrangement === "sole"
      ? initial.custody_arrangement
      : initial.custody_arrangement?.toLowerCase().includes("joint")
        ? "joint"
        : initial.custody_arrangement?.toLowerCase().includes("sole")
          ? "sole"
          : ""
  );
  const [jointByAgreement, setJointByAgreement] = useState<boolean | null>(
    initial.joint_by_agreement
  );
  const [existingOrder, setExistingOrder] = useState<boolean | null>(
    initial.has_existing_child_support_order
  );
  const [duiConviction, setDuiConviction] = useState<boolean | null>(
    initial.has_dui_or_drug_conviction
  );
  const [summerSame, setSummerSame] = useState<boolean | null>(initial.summer_schedule_same);
  const [supportPayer, setSupportPayer] = useState<string>(initial.child_support_payer ?? "");
  const [transport, setTransport] = useState<string>(initial.transportation_provider ?? "");

  function buildValues(formData: FormData) {
    const custodyValue = emptyToNull(formData.get("custody_arrangement")) || custody || null;
    const wantsParentingTime = visitationWanted === true;
    return {
      custody_arrangement: custodyValue,
      decision_making:
        custodyValue === "joint"
          ? "Joint legal decision-making"
          : custodyValue === "sole"
            ? "Sole legal decision-making"
            : emptyToNull(formData.get("decision_making")),
      parenting_time_schedule: wantsParentingTime
        ? emptyToNull(formData.get("parenting_time_schedule"))
        : null,
      visitation_wanted: visitationWanted,
      visitation_denied_reason:
        visitationWanted === false ? emptyToNull(formData.get("visitation_denied_reason")) : null,
      joint_by_agreement: custodyValue === "joint" ? jointByAgreement : null,
      child_support_payer: emptyToNull(formData.get("child_support_payer")) || supportPayer || null,
      has_existing_child_support_order: existingOrder,
      has_dui_or_drug_conviction: duiConviction,
      transportation_provider: wantsParentingTime
        ? emptyToNull(formData.get("transportation_provider")) || transport || null
        : null,
      advance_notice_days: wantsParentingTime
        ? numberOrNull(formData.get("advance_notice_days"))
        : null,
      vacation_weeks: wantsParentingTime ? numberOrNull(formData.get("vacation_weeks")) : null,
      vacation_notice_days: wantsParentingTime
        ? numberOrNull(formData.get("vacation_notice_days"))
        : null,
      summer_schedule_same: wantsParentingTime ? summerSame : null,
      summer_schedule_notes:
        wantsParentingTime && summerSame === false
          ? emptyToNull(formData.get("summer_schedule_notes"))
          : null,
      notes: emptyToNull(formData.get("notes")),
    };
  }

  async function handleSubmit(formData: FormData) {
    if (visitationWanted === null) {
      setError("Please answer whether you want your spouse to have parenting time.");
      return;
    }
    if (custody === "joint" && jointByAgreement === null) {
      setError("Please answer whether both parents agree to joint legal decision-making.");
      return;
    }
    if (!supportPayer) {
      setError("Please select who should pay child support.");
      return;
    }
    if (existingOrder === null) {
      setError("Please answer whether there is an existing child-support order.");
      return;
    }
    if (duiConviction === null) {
      setError("Please answer whether either party has a recent DUI or drug conviction.");
      return;
    }
    if (visitationWanted === true) {
      const schedule = emptyToNull(formData.get("parenting_time_schedule"));
      if (!schedule) {
        setError("A parenting-time schedule is required when parenting time is requested.");
        return;
      }
      if (!transport) {
        setError("Please select who provides transportation for exchanges.");
        return;
      }
      if (numberOrNull(formData.get("advance_notice_days")) == null) {
        setError("Please enter the advance notice period (in days) for schedule changes.");
        return;
      }
      if (summerSame === null) {
        setError("Please answer whether the summer schedule is the same as the school-year schedule.");
        return;
      }
      if (summerSame === false && !emptyToNull(formData.get("summer_schedule_notes"))) {
        setError("Describe the summer / school-break schedule.");
        return;
      }
      if (numberOrNull(formData.get("vacation_weeks")) == null) {
        setError("Please enter how many vacation weeks each parent receives.");
        return;
      }
      if (numberOrNull(formData.get("vacation_notice_days")) == null) {
        setError("Please enter how many days of notice are required for vacation plans.");
        return;
      }
    }
    setError(null);
    await saveSingletonSection("parenting", caseId, buildValues(formData), slug);
    router.push(nextHref);
  }

  async function handleAutoSave(formData: FormData) {
    await saveSingletonSection("parenting", caseId, buildValues(formData));
  }

  return (
    <StepShell
      title="Custody & Parenting"
      subtitle="Choose the arrangement you want. Be specific about weekends, weekdays, and exchanges so the parenting plan can be filled correctly."
      backHref={backHref}
      backLabel={backLabel}
      submitLabel={submitLabel}
      onSubmit={handleSubmit}
      onAutoSave={handleAutoSave}
    >
      {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}

      <Field label="What custody arrangement do you want?">
        <Select
          name="custody_arrangement"
          value={custody}
          onChange={setCustody}
          options={[
            { value: "joint", label: "Joint custody" },
            { value: "sole", label: "Sole custody" },
          ]}
          required
        />
      </Field>

      {custody === "joint" ? (
        <div>
          <p className="field-label">Do both parents agree to joint legal decision-making?</p>
          <YesNo name="joint_by_agreement" value={jointByAgreement} onChange={setJointByAgreement} />
          <p className="field-hint">
            Choose Yes only if both parents already agree. If you alone are requesting joint
            decision-making, choose No.
          </p>
        </div>
      ) : null}

      <div>
        <p className="field-label">Do you want your spouse to have visitation / parenting time?</p>
        <YesNo name="visitation_wanted" value={visitationWanted} onChange={setVisitationWanted} />
      </div>

      {visitationWanted === false ? (
        <Field label="Please explain why">
          <TextArea
            name="visitation_denied_reason"
            defaultValue={initial.visitation_denied_reason}
            rows={4}
            required
          />
        </Field>
      ) : null}

      {visitationWanted === true ? (
        <>
          <Field
            label="Proposed parenting-time schedule"
            hint="Specify who has which weekends, weekday evenings/overnights, start and end times, and exchange location. Example: Party A — weekdays; Party B — every other weekend Fri 6pm–Sun 6pm; exchanges at school."
          >
            <TextArea
              name="parenting_time_schedule"
              defaultValue={initial.parenting_time_schedule}
              rows={5}
              required
            />
          </Field>

          <Field label="Who provides transportation for parenting-time exchanges?">
            <Select
              name="transportation_provider"
              value={transport}
              onChange={setTransport}
              options={[
                { value: "client", label: "Me (Party A)" },
                { value: "spouse", label: "Spouse (Party B)" },
                { value: "shared", label: "Shared / each parent one way" },
              ]}
              required
            />
          </Field>

          <Field
            label="Advance notice for schedule changes (days)"
            hint="How many days of notice before either parent may change a timeshare by mutual agreement."
          >
            <NumberInput
              name="advance_notice_days"
              defaultValue={initial.advance_notice_days}
              min={0}
              required
            />
          </Field>

          <div>
            <p className="field-label">
              Is the summer / school-break schedule the same as the regular school-year schedule?
            </p>
            <YesNo name="summer_schedule_same" value={summerSame} onChange={setSummerSame} />
          </div>

          {summerSame === false ? (
            <Field label="Describe the summer / school-break schedule">
              <TextArea
                name="summer_schedule_notes"
                defaultValue={initial.summer_schedule_notes}
                rows={4}
                required
              />
            </Field>
          ) : null}

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Vacation weeks each parent receives per year">
              <NumberInput
                name="vacation_weeks"
                defaultValue={initial.vacation_weeks}
                min={0}
                required
              />
            </Field>
            <Field label="Days of notice required for vacation plans">
              <NumberInput
                name="vacation_notice_days"
                defaultValue={initial.vacation_notice_days}
                min={0}
                required
              />
            </Field>
          </div>
        </>
      ) : null}

      <Field label="Who should pay child support?">
        <Select
          name="child_support_payer"
          value={supportPayer}
          onChange={setSupportPayer}
          options={[
            { value: "client", label: "Me (Party A)" },
            { value: "spouse", label: "Spouse (Party B)" },
          ]}
          required
        />
      </Field>

      <div>
        <p className="field-label">Is there an existing child-support order?</p>
        <YesNo
          name="has_existing_child_support_order"
          value={existingOrder}
          onChange={setExistingOrder}
        />
      </div>

      <div>
        <p className="field-label">
          Has either party been convicted of a DUI or drug offense within the past 12 months?
        </p>
        <YesNo
          name="has_dui_or_drug_conviction"
          value={duiConviction}
          onChange={setDuiConviction}
        />
      </div>

      <Field label="Additional notes">
        <TextArea name="notes" defaultValue={initial.notes} rows={3} />
      </Field>
    </StepShell>
  );
}
