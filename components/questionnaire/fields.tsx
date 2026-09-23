export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

export function TextInput({
  name,
  defaultValue,
  type = "text",
  required,
  placeholder,
  maxLength,
  pattern,
  inputMode,
  autoComplete,
}: {
  name: string;
  defaultValue?: string | null;
  type?: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  pattern?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
}) {
  return (
    <input
      className="field-input"
      type={type}
      name={name}
      defaultValue={defaultValue ?? ""}
      required={required}
      placeholder={placeholder}
      maxLength={maxLength}
      pattern={pattern}
      inputMode={inputMode}
      autoComplete={autoComplete}
    />
  );
}

export function NumberInput({
  name,
  defaultValue,
  required,
  step = "any",
  min,
}: {
  name: string;
  defaultValue?: number | null;
  required?: boolean;
  step?: string;
  min?: number;
}) {
  return (
    <input
      className="field-input"
      type="number"
      inputMode="decimal"
      step={step}
      min={min}
      name={name}
      defaultValue={defaultValue ?? ""}
      required={required}
    />
  );
}

export function CurrencyInput(props: Omit<Parameters<typeof NumberInput>[0], "step">) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted">$</span>
      <input
        className="field-input pl-8"
        type="number"
        inputMode="decimal"
        step="0.01"
        min={0}
        name={props.name}
        defaultValue={props.defaultValue ?? ""}
        required={props.required}
      />
    </div>
  );
}

export function TextArea({
  name,
  defaultValue,
  rows = 3,
  required,
}: {
  name: string;
  defaultValue?: string | null;
  rows?: number;
  required?: boolean;
}) {
  return (
    <textarea
      className="field-input min-h-[6rem] resize-y"
      name={name}
      defaultValue={defaultValue ?? ""}
      rows={rows}
      required={required}
    />
  );
}

export function Select({
  name,
  defaultValue,
  value,
  onChange,
  options,
  required,
  placeholder = "Select…",
}: {
  name: string;
  defaultValue?: string | null;
  value?: string;
  onChange?: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
}) {
  const controlledProps =
    value !== undefined
      ? { value, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onChange?.(e.target.value) }
      : { defaultValue: defaultValue ?? "" };

  return (
    <select className="field-select" name={name} required={required} {...controlledProps}>
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// A yes/no toggle, styled as two large tappable buttons rather than a
// dropdown, since this is the question that decides whether a whole section
// of the form appears — it deserves to be unmistakable, not buried.
export function YesNo({
  name,
  value,
  onChange,
}: {
  name: string;
  value: boolean | null;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label={name}>
      <button
        type="button"
        role="radio"
        aria-checked={value === true}
        onClick={() => onChange(true)}
        className={
          value === true
            ? "rounded-xl border border-accent bg-accent-soft px-5 py-3 text-sm font-medium text-ink shadow-sm"
            : "rounded-xl border border-line bg-white px-5 py-3 text-sm font-medium text-ink hover:border-accent hover:bg-accent-soft/50"
        }
      >
        Yes
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={value === false}
        onClick={() => onChange(false)}
        className={
          value === false
            ? "rounded-xl border border-accent bg-accent-soft px-5 py-3 text-sm font-medium text-ink shadow-sm"
            : "rounded-xl border border-line bg-white px-5 py-3 text-sm font-medium text-ink hover:border-accent hover:bg-accent-soft/50"
        }
      >
        No
      </button>
    </div>
  );
}

export function WhoKeepsIt({
  name,
  defaultValue,
  options,
}: {
  name: string;
  defaultValue?: string | null;
  options?: { value: string; label: string }[];
}) {
  const opts = options ?? [
    { value: "client", label: "Me" },
    { value: "spouse", label: "Spouse" },
  ];
  return <Select name={name} defaultValue={defaultValue} options={opts} placeholder="Who keeps it?" />;
}

export function Checkbox({
  name,
  label,
  defaultChecked,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  const controlled =
    checked !== undefined
      ? { checked, onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.checked) }
      : { defaultChecked: defaultChecked ?? false };

  return (
    <label className="flex items-start gap-3 text-sm text-ink">
      <input
        type="checkbox"
        name={name}
        value="true"
        className="mt-0.5 h-4 w-4 rounded border-line text-accent focus:ring-accent"
        {...controlled}
      />
      <span>{label}</span>
    </label>
  );
}
