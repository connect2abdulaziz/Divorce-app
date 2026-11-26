"use client";

type MissionStatementSectionProps = {
  onContinue: () => void;
};

export function MissionStatementSection({ onContinue }: MissionStatementSectionProps) {
  return (
    <section className="ldd-mission" aria-labelledby="mission-heading">
      <div className="ldd-mission__inner">
        <h2 id="mission-heading" className="ldd-mission__title">
          A difficult chapter.{" "}
          <span className="ldd-mission__title-accent">A simpler way to move forward.</span>
        </h2>
        <a
          className="ldd-mission__link"
          href="#qualify"
          onClick={(event) => {
            event.preventDefault();
            onContinue();
          }}
        >
          When you&apos;re ready, find your package
        </a>
      </div>
    </section>
  );
}