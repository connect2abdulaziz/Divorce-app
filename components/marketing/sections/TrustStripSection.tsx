const TRUST_STRIP_ITEMS = [
  "Arizona Certified Document Preparer",
  "Arizona-focused Document Preparation",
  "Guided Online Process",
] as const;

export function TrustStripSection() {
  return (
    <section className="ldd-trust-strip" aria-label="Service credentials">
      <div className="ldd-trust-strip__inner">
        <div className="ldd-trust-strip__bar">
          <p className="ldd-trust-strip__item">{TRUST_STRIP_ITEMS[0]}</p>
          <span className="ldd-trust-strip__rule" aria-hidden="true" />
          <p className="ldd-trust-strip__item">{TRUST_STRIP_ITEMS[1]}</p>
          <span className="ldd-trust-strip__rule" aria-hidden="true" />
          <p className="ldd-trust-strip__item">{TRUST_STRIP_ITEMS[2]}</p>
        </div>
      </div>
    </section>
  );
}