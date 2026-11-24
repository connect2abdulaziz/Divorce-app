const INPUT_CLASS = "ldd-q-input";
const SELECT_CLASS = "ldd-q-select";

export function Field({
  label,
  hint,
  children,
  required,
  optional,
  htmlFor,
  error,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  htmlFor?: string;
  error?: string;
}) {
  return (
    <div className="ldd-q-field">
      <label className="ldd-q-label" htmlFor={htmlFor}>
        <span className="ldd-q-label__text">{label}</span>
        {required ? (
          <span className="ldd-q-required" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
        {optional && !required ? <span className="ldd-q-optional"> (optional)</span> : null}
      </label>
      <div className="ldd-q-field__control">{children}</div>
      {hint ? <p className="ldd-q-hint">{hint}</p> : null}
      {error ? (
        <p className="ldd-q-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function FormDependent({ children }: { children: React.ReactNode }) {
  return <div className="ldd-q-dependent">{children}</div>;
}

export function TextInput({
  name,
  defaultValue,
  type = "text",
  required,
  placeholder,
  maxLength,
  min,
  max,
  pattern,
  inputMode,
  autoComplete,
  title,
  onInput,
  "aria-invalid": ariaInvalid,
}: {
  name: string;
  defaultValue?: string | null;
  type?: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  min?: string | number;
  max?: string | number;
  pattern?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  title?: string;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  "aria-invalid"?: boolean;
}) {
  return (
    <input
      className={INPUT_CLASS}
      id={name}
      type={type}
      name={name}
      defaultValue={defaultValue ?? ""}
      required={required}
      placeholder={placeholder}
      maxLength={maxLength}
      min={min}
      max={max}
      pattern={pattern}
      inputMode={inputMode}
      autoComplete={autoComplete}
      title={title}
      onInput={onInput}
      aria-invalid={ariaInvalid}
    />
  );
}

function todayIsoDate() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** Returns null when empty; throws if the date is in the future. */
export function requirePastOrTodayDate(value: string | null | undefined, label = "Date of birth") {
  if (value == null || value === "") return null;
  if (value > todayIsoDate()) {
    throw new Error(`${label} cannot be in the future.`);
  }
  return value;
}

export function BirthDateInput({
  name,
  defaultValue,
  required,
}: {
  name: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  return (
    <TextInput
      name={name}
      type="date"
      defaultValue={defaultValue}
      required={required}
      max={todayIsoDate()}
      title="Date of birth cannot be in the future"
    />
  );
}

const PHONE_CHARS = /[^0-9+()\-.\s]/g;

export function sanitizePhone(value: string | null | undefined) {
  if (value == null) return null;
  const cleaned = String(value).replace(PHONE_CHARS, "").trim();
  return cleaned === "" ? null : cleaned;
}

export function PhoneInput({
  name,
  defaultValue,
  required,
  placeholder,
}: {
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <TextInput
      name={name}
      type="tel"
      defaultValue={sanitizePhone(defaultValue) ?? defaultValue}
      required={required}
      placeholder={placeholder}
      inputMode="tel"
      autoComplete="tel"
      pattern="[0-9+()\\-.\\s]*"
      title="Use numbers only (and + ( ) - . spaces)"
      onInput={(e) => {
        const input = e.currentTarget;
        const cleaned = input.value.replace(PHONE_CHARS, "");
        if (cleaned !== input.value) input.value = cleaned;
      }}
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
      className={INPUT_CLASS}
      id={name}
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
    <div className="ldd-q-currency">
      <span className="ldd-q-currency__prefix" aria-hidden="true">
        $
      </span>
      <input
        className={`${INPUT_CLASS} ldd-q-currency__input`}
        id={props.name}
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
      className={`${INPUT_CLASS} ldd-q-textarea`}
      id={name}
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
    <select
      className={SELECT_CLASS}
      id={name}
      name={name}
      required={required}
      {...controlledProps}
    >
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

function yesNoOptionClass(selected: boolean) {
  return selected ? "ldd-q-yesno__option is-selected" : "ldd-q-yesno__option";
}

export function YesNo({
  name,
  value,
  onChange,
  label,
}: {
  name: string;
  value: boolean | null;
  onChange: (next: boolean) => void;
  /** Accessible name when not wrapped in QuestionBlock */
  label?: string;
}) {
  const groupLabel = label ?? name;
  return (
    <div className="ldd-q-yesno" role="radiogroup" aria-label={groupLabel}>
      <button
        type="button"
        role="radio"
        aria-checked={value === true}
        onClick={() => onChange(true)}
        className={yesNoOptionClass(value === true)}
      >
        <span className="ldd-q-yesno__indicator" aria-hidden="true" />
        <span>Yes</span>
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={value === false}
        onClick={() => onChange(false)}
        className={yesNoOptionClass(value === false)}
      >
        <span className="ldd-q-yesno__indicator" aria-hidden="true" />
        <span>No</span>
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
    <label className="ldd-q-checkbox">
      <input
        type="checkbox"
        name={name}
        value="true"
        className="ldd-q-checkbox__input"
        {...controlled}
      />
      <span className="ldd-q-checkbox__label">{label}</span>
    </label>
  );
}