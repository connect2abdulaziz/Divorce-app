"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateCaseGates } from "@/lib/questionnaire/actions";
import type { RepeatableTable } from "@/lib/questionnaire/data";
import { YesNo } from "./fields";
import { RepeatableList, type FieldConfig, type SummaryConfig } from "./RepeatableList";
import { StepFrame } from "./StepFrame";

type GateColumn =
  | "has_real_estate"
  | "has_vehicles"
  | "has_retirement_accounts"
  | "has_community_debts"
  | "has_household_property"
  | "has_separate_property"
  | "has_separate_debts";

type Row = Record<string, unknown> & { id: string };

export function GatedRepeatableStep({
  caseId,
  slug,
  backHref,
  backLabel,
  nextHref,
  submitLabel,
  title,
  subtitle,
  gateColumn,
  gateValue,
  gateQuestion,
  table,
  records,
  fields,
  summary,
  addLabel,
  emptyLabel,
}: {
  caseId: string;
  slug: string;
  backHref: string | null;
  backLabel?: string;
  nextHref: string;
  submitLabel?: string;
  title: string;
  subtitle?: string;
  gateColumn: GateColumn;
  gateValue: boolean | null;
  gateQuestion: string;
  table: RepeatableTable;
  records: Row[];
  fields: FieldConfig[];
  summary: SummaryConfig;
  addLabel: string;
  emptyLabel: string;
}) {
  const router = useRouter();
  const [gate, setGate] = useState<boolean | null>(gateValue);

  async function handleContinue() {
    await updateCaseGates(caseId, { [gateColumn]: gate ?? false }, slug);
    router.push(nextHref);
  }

  return (
    <StepFrame
      title={title}
      subtitle={subtitle}
      backHref={backHref}
      backLabel={backLabel}
      continueLabel={submitLabel}
      onContinue={handleContinue}
    >
      <div>
        <p className="field-label">{gateQuestion}</p>
        <YesNo name={gateColumn} value={gate} onChange={setGate} />
      </div>

      {gate === true && (
        <RepeatableList
          table={table}
          caseId={caseId}
          records={records}
          fields={fields}
          summary={summary}
          addLabel={addLabel}
          emptyLabel={emptyLabel}
        />
      )}
    </StepFrame>
  );
}
