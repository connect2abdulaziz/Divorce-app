"use client";

import { useFormStatus } from "react-dom";

export function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V2C5.373 2 0 7.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  disabled?: boolean;
};

/** Submit button for Server Action forms — shows spinner while the action runs. */
export function SubmitButton({
  children,
  pendingLabel,
  className = "btn-primary w-full",
  disabled = false,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const busy = pending || disabled;

  return (
    <button type="submit" className={className} disabled={busy} aria-busy={pending}>
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <Spinner />
          {pendingLabel ?? children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
