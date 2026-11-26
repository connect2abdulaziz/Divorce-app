"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { continueCase, openCase, startNewQuestionnaire } from "@/app/dashboard/actions";
import { GenerateDocumentsButton } from "@/components/documents/GenerateDocumentsButton";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { DashboardCaseItem } from "@/lib/dashboard/present";

type FilterKey = "all" | "in_progress" | "submitted";

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 2h8l4 4v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M16 2v4h4M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10m0 0-3.5-3.5M13 8l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function statusLabel(item: DashboardCaseItem) {
  if (item.questionnaireStatus === "submitted") return "Submitted";
  if (item.questionnaireStatus === "completed") return "Completed";
  return "In progress";
}

function pickFeatured(items: DashboardCaseItem[]): DashboardCaseItem | null {
  const inProgress = items.filter((i) => i.inProgress);
  if (!inProgress.length) return null;
  return [...inProgress].sort((a, b) => {
    const ta = a.lastSavedAt ? new Date(a.lastSavedAt).getTime() : 0;
    const tb = b.lastSavedAt ? new Date(b.lastSavedAt).getTime() : 0;
    return tb - ta;
  })[0];
}

function matchesFilter(item: DashboardCaseItem, filter: FilterKey) {
  if (filter === "all") return true;
  if (filter === "in_progress") return item.inProgress;
  return item.isSubmittedLike;
}

function CardProgressBar({ percent, variant }: { percent: number; variant: "row" | "featured" }) {
  const clamped = Math.min(100, Math.max(0, percent));
  const className =
    variant === "featured" ? "ldd-dashboard-featured__bar" : "ldd-dashboard-row__bar";
  const fillClass =
    variant === "featured" ? "ldd-dashboard-featured__bar-fill" : "ldd-dashboard-row__bar-fill";

  return (
    <div className={className} aria-hidden="true">
      <div className={fillClass} style={{ width: `${clamped}%` }} />
    </div>
  );
}

function IntroCopy() {
  return (
    <div className="ldd-dashboard-intro__copy">
      <p className="ldd-dashboard-intro__eyebrow">Your client workspace</p>
      <h1 id="dashboard-heading" className="ldd-dashboard-intro__title">
        Your dashboard
      </h1>
      <p className="ldd-dashboard-intro__desc">
        Manage your questionnaires and continue at your own pace.
      </p>
    </div>
  );
}

function QuestionnaireRow({ item }: { item: DashboardCaseItem }) {
  const label = statusLabel(item);
  const badgeClass = item.inProgress
    ? "ldd-dashboard-row__badge ldd-dashboard-row__badge--progress"
    : "ldd-dashboard-row__badge ldd-dashboard-row__badge--submitted";

  return (
    <li className="ldd-dashboard-row">
      <div className="ldd-dashboard-row__main">
        <div className="ldd-dashboard-row__start">
          <span className="ldd-dashboard-row__icon-wrap">
            <DocumentIcon className="ldd-dashboard-row__icon" />
          </span>
          <div className="ldd-dashboard-row__body">
            <div className="ldd-dashboard-row__headline">
              <span className="ldd-dashboard-row__name">{item.title}</span>
              <span className={badgeClass}>{label}</span>
            </div>
            <p className="ldd-dashboard-row__meta">
              {item.inProgress ? (
                <>Last saved {item.lastSavedFormatted}</>
              ) : (
                <>
                  Submitted {item.submittedFormatted} · Started {item.startedFormatted}
                </>
              )}
            </p>
            {item.inProgress && item.percent != null ? (
              <div className="ldd-dashboard-row__progress">
                <CardProgressBar percent={item.percent} variant="row" />
                <span className="ldd-dashboard-row__progress-text">{item.percent}% complete</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="ldd-dashboard-row__actions">
          <form action={openCase.bind(null, item.id)}>
            <SubmitButton
              className="ldd-dashboard__btn ldd-dashboard__btn--outline"
              pendingLabel="Opening…"
            >
              View
            </SubmitButton>
          </form>
          {item.inProgress ? (
            <form action={continueCase.bind(null, item.id)}>
              <SubmitButton
                className="ldd-dashboard__btn ldd-dashboard__btn--primary"
                pendingLabel="Loading…"
              >
                Continue
              </SubmitButton>
            </form>
          ) : (
            <GenerateDocumentsButton
              caseId={item.id}
              className="ldd-dashboard__btn ldd-dashboard__btn--outline"
              label="Generate documents"
            />
          )}
        </div>
      </div>
    </li>
  );
}

export function ClientDashboard({ items }: { items: DashboardCaseItem[] }) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const listRef = useRef<HTMLDivElement>(null);
  const listHeightAllRef = useRef(0);
  const [listMinHeight, setListMinHeight] = useState<number | undefined>(undefined);

  const counts = useMemo(
    () => ({
      all: items.length,
      in_progress: items.filter((i) => i.inProgress).length,
      submitted: items.filter((i) => i.isSubmittedLike).length,
    }),
    [items],
  );

  const featured = useMemo(() => pickFeatured(items), [items]);

  const filtered = useMemo(() => items.filter((i) => matchesFilter(i, filter)), [items, filter]);

  useLayoutEffect(() => {
    const el = listRef.current;
    if (!el || items.length === 0 || filter !== "all") return;

    const measure = () => {
      const height = Math.ceil(el.getBoundingClientRect().height);
      listHeightAllRef.current = height;
      setListMinHeight(height);
    };

    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [filter, filtered, items]);

  useLayoutEffect(() => {
    if (items.length === 0) {
      listHeightAllRef.current = 0;
      setListMinHeight(undefined);
    }
  }, [items.length]);

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: `All (${counts.all})` },
    { key: "in_progress", label: `In progress (${counts.in_progress})` },
    { key: "submitted", label: `Submitted (${counts.submitted})` },
  ];

  if (items.length === 0) {
    return (
      <>
        <section className="ldd-dashboard-intro ldd-dashboard-intro--empty">
          <IntroCopy />
          <form action={startNewQuestionnaire}>
            <SubmitButton
              className="ldd-dashboard__btn ldd-dashboard__btn--primary"
              pendingLabel="Starting…"
            >
              <span className="ldd-dashboard__btn-inner">
                <PlusIcon />
                Start new questionnaire
              </span>
            </SubmitButton>
          </form>
        </section>
        <div className="ldd-dashboard-empty">
          <p className="ldd-dashboard-empty__title">No questionnaires yet</p>
          <p className="ldd-dashboard-empty__text">
            Start your first questionnaire to collect the information needed for your Arizona divorce
            documents.
          </p>
          <form action={startNewQuestionnaire}>
            <SubmitButton
              className="ldd-dashboard__btn ldd-dashboard__btn--primary"
              pendingLabel="Starting…"
            >
              Start questionnaire
            </SubmitButton>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <section className="ldd-dashboard-intro" aria-labelledby="dashboard-heading">
        <IntroCopy />
        <form action={startNewQuestionnaire} className="ldd-dashboard-intro__action">
          <SubmitButton
            className="ldd-dashboard__btn ldd-dashboard__btn--primary"
            pendingLabel="Starting…"
          >
            <span className="ldd-dashboard__btn-inner">
              <PlusIcon />
              Start new questionnaire
            </span>
          </SubmitButton>
        </form>
      </section>

      {featured ? (
        <section className="ldd-dashboard-featured" aria-labelledby="featured-heading">
          <div className="ldd-dashboard-featured__header">
            <h2 id="featured-heading" className="ldd-dashboard-featured__heading">
              Continue where you left off
            </h2>
            <p className="ldd-dashboard-featured__subhead">Last active questionnaire</p>
          </div>
          <div className="ldd-dashboard-featured__panel">
            <div className="ldd-dashboard-featured__top">
              <span className="ldd-dashboard-featured__icon-wrap">
                <DocumentIcon className="ldd-dashboard-featured__icon" />
              </span>
              <div className="ldd-dashboard-featured__meta">
                <p className="ldd-dashboard-featured__eyebrow">Arizona divorce questionnaire</p>
                <div className="ldd-dashboard-featured__title-row">
                  <h3 className="ldd-dashboard-featured__name">{featured.title}</h3>
                  <span className="ldd-dashboard-featured__status">In progress</span>
                </div>
              </div>
            </div>

            <section className="ldd-dashboard-featured__progress-block" aria-label="Questionnaire progress">
              <p className="ldd-dashboard-featured__progress-label">Questionnaire progress</p>
              <div className="ldd-dashboard-featured__progress-stats">
                <span className="ldd-dashboard-featured__percent" aria-label="Completion percentage">
                  {featured.percent ?? 0}%
                </span>
                <span className="ldd-dashboard-featured__saved">
                  Last saved {featured.lastSavedFormatted}
                </span>
              </div>
              <CardProgressBar percent={featured.percent ?? 0} variant="featured" />
            </section>

            <div className="ldd-dashboard-featured__divider" role="presentation" />

            <div className="ldd-dashboard-featured__footer">
              <p className="ldd-dashboard-featured__hint">Resume your saved questionnaire.</p>
              <div className="ldd-dashboard-featured__actions">
                <form action={openCase.bind(null, featured.id)}>
                  <SubmitButton
                    className="ldd-dashboard__btn ldd-dashboard__btn--outline"
                    pendingLabel="Opening…"
                  >
                    View answers
                  </SubmitButton>
                </form>
                <form action={continueCase.bind(null, featured.id)}>
                  <SubmitButton
                    className="ldd-dashboard__btn ldd-dashboard__btn--primary"
                    pendingLabel="Loading…"
                  >
                    <span className="ldd-dashboard__btn-inner">
                      Continue
                      <ArrowIcon />
                    </span>
                  </SubmitButton>
                </form>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="ldd-dashboard-questionnaires" aria-labelledby="questionnaires-heading">
        <h2 id="questionnaires-heading" className="ldd-dashboard-questionnaires__title">
          Your questionnaires
        </h2>
        <p className="ldd-dashboard-questionnaires__desc">
          Access and manage your saved and submitted questionnaires.
        </p>

        <div className="ldd-dashboard-filters" role="tablist" aria-label="Filter questionnaires">
          {filters.map(({ key, label }) => {
            const selected = filter === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                id={`filter-tab-${key}`}
                aria-selected={selected}
                aria-controls="questionnaire-list"
                tabIndex={selected ? 0 : -1}
                className={`ldd-dashboard-filters__tab${selected ? " is-active" : ""}`}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div
          id="questionnaire-list"
          ref={listRef}
          role="tabpanel"
          aria-labelledby={`filter-tab-${filter}`}
          className="ldd-dashboard-list"
          style={
            listMinHeight != null && listMinHeight > 0
              ? { minHeight: listMinHeight }
              : undefined
          }
        >
          {filtered.length === 0 ? (
            <p className="ldd-dashboard-list__empty">
              No questionnaires match this filter. Try another tab or start a new questionnaire.
            </p>
          ) : (
            <ul className="ldd-dashboard-list__rows">
              {filtered.map((item) => (
                <QuestionnaireRow key={item.id} item={item} />
              ))}
            </ul>
          )}
        </div>

        <p className="ldd-dashboard-list__footnote">
          <span>
            Showing {filtered.length} of {items.length} questionnaires
          </span>
          <span className="ldd-dashboard-list__footnote-sep" aria-hidden="true">
            ·
          </span>
          <span>Each case is saved separately.</span>
        </p>
      </section>
    </>
  );
}