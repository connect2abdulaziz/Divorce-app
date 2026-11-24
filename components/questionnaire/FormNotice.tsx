import type { ReactNode } from "react";

export function FormNotice({
  variant = "info",
  title,
  children,
}: {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className={`ldd-q-notice ldd-q-notice--${variant}`} role={variant === "error" ? "alert" : undefined}>
      {title ? <p className="ldd-q-notice__title">{title}</p> : null}
      <div className="ldd-q-notice__body">{children}</div>
    </div>
  );
}

export function RequiredFieldsLegend() {
  return (
    <p className="ldd-q-required-legend">
      Fields marked with <span className="ldd-q-required" aria-hidden="true">*</span> are required.
    </p>
  );
}