"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon } from "./Icon";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  icon?: string;
  variant?: "white" | string;
  className?: string;
  loading?: boolean;
  loadingLabel?: string;
};

export function PrimaryButton({
  children,
  icon,
  variant,
  className = "",
  type = "button",
  disabled = false,
  loading = false,
  loadingLabel,
  ...props
}: PrimaryButtonProps) {
  const classes = ["primary-button", variant === "white" && "white", className]
    .filter(Boolean)
    .join(" ");
  const busy = disabled || loading;

  return (
    <button type={type} className={classes} disabled={busy} aria-busy={loading} {...props}>
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
          {loadingLabel ?? children}
        </span>
      ) : (
        <>
          <span>{children}</span>
          {icon ? <Icon name={icon} size={18} /> : null}
        </>
      )}
    </button>
  );
}
