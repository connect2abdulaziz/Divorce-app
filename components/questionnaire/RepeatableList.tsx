"use client";

import { useState, useTransition } from "react";
import { addRecord, deleteRecord, updateRecord } from "@/lib/questionnaire/actions";
import type { RepeatableTable } from "@/lib/questionnaire/data";
import { Spinner } from "@/components/ui/SubmitButton";
import { CurrencyInput, NumberInput, Select, TextInput } from "./fields";

export type FieldConfig =
  | { name: string; label: string; kind: "text"; required?: boolean }
  | { name: string; label: string; kind: "number"; required?: boolean }
  | { name: string; label: string; kind: "currency"; required?: boolean }
  | { name: string; label: string; kind: "select"; options: { value: string; label: string }[]; required?: boolean };

export type SummaryConfig = {
  titleFields: string[];
  titleFallback: string;
  details: { field: string; kind: "currency" | "text"; label: string }[];
};

type Row = Record<string, unknown> & { id: string };

function hasValue(value: unknown) {
  return value != null && value !== "";
}

function summarizeRow(row: Row, config: SummaryConfig) {
  const title =
    config.titleFields
      .map((field) => row[field])
      .filter(hasValue)
      .join(" ") || config.titleFallback;

  const detail = config.details
    .map((part) => {
      const value = row[part.field];
      if (!hasValue(value)) return null;
      return part.kind === "currency" ? `${part.label} $${value}` : `${part.label} ${value}`;
    })
    .filter(Boolean)
    .join(" · ");

  return { title, detail };
}

function parseFields(formData: FormData, fields: FieldConfig[]) {
  const values: Record<string, unknown> = {};
  for (const f of fields) {
    const raw = formData.get(f.name);
    if (f.kind === "number" || f.kind === "currency") {
      values[f.name] = raw === null || raw === "" ? null : Number(raw);
    } else {
      values[f.name] = raw === null || raw === "" ? null : String(raw);
    }
  }
  return values;
}

function FieldInput({ field, defaultValue }: { field: FieldConfig; defaultValue?: unknown }) {
  if (field.kind === "currency") {
    return (
      <CurrencyInput
        name={field.name}
        defaultValue={defaultValue as number | null}
        required={field.required}
      />
    );
  }
  if (field.kind === "number") {
    return (
      <NumberInput name={field.name} defaultValue={defaultValue as number | null} required={field.required} />
    );
  }
  if (field.kind === "select") {
    return (
      <Select
        name={field.name}
        defaultValue={defaultValue as string | null}
        options={field.options}
        required={field.required}
      />
    );
  }
  return <TextInput name={field.name} defaultValue={defaultValue as string | null} required={field.required} />;
}

function RecordForm({
  fields,
  defaults,
  onCancel,
  onSubmit,
  submitLabel,
}: {
  fields: FieldConfig[];
  defaults?: Row;
  onCancel: () => void;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  submitLabel: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = parseFields(formData, fields);
    startTransition(async () => {
      await onSubmit(values);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-line bg-[#F7F6F1] p-4 md:p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={f.kind === "select" ? "" : "sm:col-span-1"}>
            <label className="field-label">{f.label}</label>
            <FieldInput field={f} defaultValue={defaults?.[f.name]} />
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-3">
        <button type="submit" className="btn-primary" disabled={isPending} aria-busy={isPending}>
          {isPending ? (
            <span className="inline-flex items-center gap-2">
              <Spinner />
              Saving…
            </span>
          ) : (
            submitLabel
          )}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={isPending}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export function RepeatableList({
  table,
  caseId,
  records,
  fields,
  summary,
  addLabel,
  emptyLabel,
}: {
  table: RepeatableTable;
  caseId: string;
  records: Row[];
  fields: FieldConfig[];
  summary: SummaryConfig;
  addLabel: string;
  emptyLabel: string;
}) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteRecord(table, id);
    });
  }

  return (
    <div className="space-y-3">
      {records.length === 0 && !adding && <p className="text-muted">{emptyLabel}</p>}

      {records.map((row) => {
        const { title, detail } = summarizeRow(row, summary);
        if (editingId === row.id) {
          return (
            <RecordForm
              key={row.id}
              fields={fields}
              defaults={row}
              submitLabel="Save"
              onCancel={() => setEditingId(null)}
              onSubmit={async (values) => {
                await updateRecord(table, row.id, values);
                setEditingId(null);
              }}
            />
          );
        }
        return (
          <div
            key={row.id}
            className="flex items-center justify-between rounded-xl border border-line bg-[#FBFBF8] px-4 py-3.5"
          >
            <div>
              <p className="text-ink">{title}</p>
              {detail && <p className="text-sm text-muted">{detail}</p>}
            </div>
            <div className="flex gap-4 text-sm">
              <button type="button" className="btn-text" onClick={() => setEditingId(row.id)}>
                Edit
              </button>
              <button type="button" className="btn-danger-text" onClick={() => handleDelete(row.id)}>
                Remove
              </button>
            </div>
          </div>
        );
      })}

      {adding ? (
        <RecordForm
          fields={fields}
          submitLabel="Add"
          onCancel={() => setAdding(false)}
          onSubmit={async (values) => {
            await addRecord(table, caseId, values);
            setAdding(false);
          }}
        />
      ) : (
        <button type="button" className="btn-secondary" onClick={() => setAdding(true)}>
          {addLabel}
        </button>
      )}
    </div>
  );
}
