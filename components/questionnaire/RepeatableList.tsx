"use client";

import { useEffect, useState, useTransition } from "react";
import { addRecord, deleteRecord, updateRecord } from "@/lib/questionnaire/actions";
import type { RepeatableTable } from "@/lib/questionnaire/data";
import { Spinner } from "@/components/ui/SubmitButton";
import { CurrencyInput, Field, NumberInput, Select, TextArea, TextInput } from "./fields";

export type FieldConfig =
  | { name: string; label: string; kind: "text"; required?: boolean }
  | { name: string; label: string; kind: "textarea"; required?: boolean }
  | { name: string; label: string; kind: "number"; required?: boolean }
  | { name: string; label: string; kind: "currency"; required?: boolean }
  | {
      name: string;
      label: string;
      kind: "select";
      options: { value: string; label: string }[];
      required?: boolean;
    };

export type SummaryConfig = {
  titleFields: string[];
  titleFallback: string;
  details: {
    field: string;
    kind: "currency" | "text";
    label: string;
    valueLabels?: Record<string, string>;
  }[];
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
      if (part.kind === "currency") return `${part.label} $${value}`;
      const display =
        part.valueLabels && typeof value === "string"
          ? part.valueLabels[value] ?? value
          : value;
      return `${part.label} ${display}`;
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
  if (field.kind === "textarea") {
    return (
      <TextArea
        name={field.name}
        defaultValue={defaultValue as string | null}
        rows={3}
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
  validate,
}: {
  fields: FieldConfig[];
  defaults?: Row;
  onCancel: () => void;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  submitLabel: string;
  validate?: (values: Record<string, unknown>) => string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = parseFields(formData, fields);
    const validationError = validate?.(values) ?? null;
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    startTransition(async () => {
      await onSubmit(values);
    });
  }

  const heading = submitLabel === "Add" ? "Add item" : "Edit item";

  return (
    <form onSubmit={handleSubmit} className="ldd-q-record-form">
      <p className="ldd-q-record-form__title">{heading}</p>
      <div className="ldd-q-grid ldd-q-grid--2">
        {fields.map((f) => (
          <div key={f.name} className={f.kind === "select" ? "ldd-q-grid__full" : undefined}>
            <Field label={f.label} htmlFor={f.name} required={f.required}>
              <FieldInput field={f} defaultValue={defaults?.[f.name]} />
            </Field>
          </div>
        ))}
      </div>
      {error ? <p className="ldd-q-error">{error}</p> : null}
      <div className="ldd-q-record-form__actions">
        <button type="submit" className="ldd-q-btn ldd-q-btn--primary" disabled={isPending} aria-busy={isPending}>
          {isPending ? (
            <span className="inline-flex items-center gap-2">
              <Spinner />
              Saving…
            </span>
          ) : (
            submitLabel
          )}
        </button>
        <button type="button" className="ldd-q-btn ldd-q-btn--secondary" onClick={onCancel} disabled={isPending}>
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
  validate,
  onDirtyChange,
}: {
  table: RepeatableTable;
  caseId: string;
  records: Row[];
  fields: FieldConfig[];
  summary: SummaryConfig;
  addLabel: string;
  emptyLabel: string;
  validate?: (values: Record<string, unknown>) => string | null;
  /** Fires when an Add/Edit form is open so the parent can block Save & continue. */
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    onDirtyChange?.(adding || editingId != null);
  }, [adding, editingId, onDirtyChange]);

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteRecord(table, id);
    });
  }

  return (
    <div className="ldd-q-repeat">
      {records.length === 0 && !adding && <p className="ldd-q-repeat__empty">{emptyLabel}</p>}

      {records.map((row) => {
        const { title, detail } = summarizeRow(row, summary);
        if (editingId === row.id) {
          return (
            <RecordForm
              key={row.id}
              fields={fields}
              defaults={row}
              submitLabel="Save"
              validate={validate}
              onCancel={() => setEditingId(null)}
              onSubmit={async (values) => {
                await updateRecord(table, row.id, values);
                setEditingId(null);
              }}
            />
          );
        }
        return (
          <div key={row.id} className="ldd-q-repeat__item">
            <div>
              <p className="ldd-q-repeat__title">{title}</p>
              {detail ? <p className="ldd-q-repeat__detail">{detail}</p> : null}
            </div>
            <div className="ldd-q-repeat__actions">
              <button type="button" className="ldd-q-btn ldd-q-btn--text" onClick={() => setEditingId(row.id)}>
                Edit
              </button>
              <button type="button" className="ldd-q-btn ldd-q-btn--danger" onClick={() => handleDelete(row.id)}>
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
          validate={validate}
          onCancel={() => setAdding(false)}
          onSubmit={async (values) => {
            await addRecord(table, caseId, values);
            setAdding(false);
          }}
        />
      ) : (
        <button type="button" className="ldd-q-btn ldd-q-btn--secondary" onClick={() => setAdding(true)}>
          {addLabel}
        </button>
      )}
    </div>
  );
}
