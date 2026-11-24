import type { ReactNode } from "react";

export function FormSection({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`ldd-q-section ${className}`.trim()}>
      <div className="ldd-q-section__head">
        <h3 className="ldd-q-section__title">{title}</h3>
        {description ? <p className="ldd-q-section__desc">{description}</p> : null}
      </div>
      <div className="ldd-q-section__body">{children}</div>
    </section>
  );
}