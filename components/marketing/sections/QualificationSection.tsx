"use client";

import { useEffect, useState } from "react";
import { HELP_OPTIONS, QUALIFY_STORAGE_KEY } from "@/lib/marketing/content";
import { PrimaryButton } from "../ui/PrimaryButton";

type Answers = {
  children: string | null;
  property: string | null;
  help: string | null;
};

const initialAnswers: Answers = {
  children: null,
  property: null,
  help: null,
};

const REASSURANCE_POINTS = [
  "Just three simple questions",
  "Explore your service options",
  "No payment required to answer",
] as const;

function normalizeAnswers(raw: Partial<Answers> | null | undefined): Answers {
  return {
    children: raw?.children === "yes" || raw?.children === "no" ? raw.children : null,
    property: raw?.property === "yes" || raw?.property === "no" ? raw.property : null,
    help: raw?.help === "online" || raw?.help === "guided" ? raw.help : null,
  };
}

function readStoredAnswers(): Answers | null {
  try {
    const raw = sessionStorage.getItem(QUALIFY_STORAGE_KEY);
    if (!raw) return null;
    return normalizeAnswers(JSON.parse(raw) as Partial<Answers>);
  } catch {
    return null;
  }
}

function readUrlAnswers(): Answers {
  try {
    const params = new URLSearchParams(window.location.search);
    return normalizeAnswers({
      children: params.get("children"),
      property: params.get("property"),
      help: params.get("help"),
    });
  } catch {
    return initialAnswers;
  }
}

function writeStoredAnswers(answers: Answers) {
  try {
    sessionStorage.setItem(QUALIFY_STORAGE_KEY, JSON.stringify(answers));
  } catch {
    // Ignore quota / private-mode failures; answers still work in-session.
  }
}

export function QualificationSection({
  onComplete,
  presetHelp = null,
}: {
  onComplete: (answers: Answers) => void;
  presetHelp?: string | null;
}) {
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const fromUrl = readUrlAnswers();
    const stored = readStoredAnswers();
    setAnswers({
      children: fromUrl.children ?? stored?.children ?? null,
      property: fromUrl.property ?? stored?.property ?? null,
      help: presetHelp ?? fromUrl.help ?? stored?.help ?? null,
    });
    setHydrated(true);
  }, [presetHelp]);

  useEffect(() => {
    if (!hydrated) return;
    writeStoredAnswers(answers);
  }, [answers, hydrated]);

  const ready =
    answers.children !== null && answers.property !== null && answers.help !== null;

  const setAnswer = (key: keyof Answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const completionSegments = [
    {
      key: "children",
      answered: answers.children === "yes" || answers.children === "no",
    },
    {
      key: "property",
      answered: answers.property === "yes" || answers.property === "no",
    },
    {
      key: "help",
      answered: answers.help === "online" || answers.help === "guided",
    },
  ];

  const answeredCount = completionSegments.filter((segment) => segment.answered).length;

  return (
    <section className="ldd-qualify" id="qualify" aria-labelledby="qualify-heading">
      <div className="ldd-qualify__inner">
        <div className="ldd-qualify__canvas">
          <div className="ldd-qualify__intro">
            <p className="ldd-qualify__eyebrow">Find your package</p>
            <h2 id="qualify-heading" className="ldd-qualify__heading">
              Find the right divorce package for you.
            </h2>
            <p className="ldd-qualify__description">
              Answer a few simple questions about your situation.
            </p>
            <ul className="ldd-qualify__reassurance">
              {REASSURANCE_POINTS.map((point) => (
                <li key={point} className="ldd-qualify__reassurance-item">
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <hr className="ldd-qualify__col-rule" aria-hidden="true" />

          <form
            className="ldd-qualify__form"
            onSubmit={(event) => {
              event.preventDefault();
              if (!ready) return;
              writeStoredAnswers(answers);
              onComplete(answers);
            }}
          >
            <div className="ldd-qualify__progress">
              <div className="ldd-qualify__progress-header">
                <span className="ldd-qualify__form-label">Your situation</span>
                <span className="ldd-qualify__progress-count" role="status">
                  {answeredCount} of 3 answered
                </span>
              </div>
              <div className="ldd-qualify__progress-track" aria-hidden="true">
                {completionSegments.map((segment) => (
                  <span
                    key={segment.key}
                    className={
                      segment.answered
                        ? "ldd-qualify__segment is-complete"
                        : "ldd-qualify__segment"
                    }
                  />
                ))}
              </div>
            </div>

            <fieldset className="ldd-qualify__question">
              <legend className="ldd-qualify__legend">
                <span className="ldd-qualify__question-number" aria-hidden="true">
                  01
                </span>
                <span>Do you have children under 18 with your spouse?</span>
              </legend>
              <div className="ldd-qualify__choice-row" role="group">
                {["yes", "no"].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className="ldd-qualify__choice"
                    aria-pressed={answers.children === value}
                    onClick={() => setAnswer("children", value)}
                  >
                    <span className="ldd-qualify__radio" aria-hidden="true" />
                    {value === "yes" ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            </fieldset>

            <hr className="ldd-qualify__divider" aria-hidden="true" />

            <fieldset className="ldd-qualify__question">
              <legend className="ldd-qualify__legend">
                <span className="ldd-qualify__question-number" aria-hidden="true">
                  02
                </span>
                <span>Do you and your spouse have property or debts to divide?</span>
              </legend>
              <div className="ldd-qualify__choice-row" role="group">
                {["yes", "no"].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className="ldd-qualify__choice"
                    aria-pressed={answers.property === value}
                    onClick={() => setAnswer("property", value)}
                  >
                    <span className="ldd-qualify__radio" aria-hidden="true" />
                    {value === "yes" ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            </fieldset>

            <hr className="ldd-qualify__divider" aria-hidden="true" />

            <fieldset className="ldd-qualify__question">
              <legend className="ldd-qualify__legend">
                <span className="ldd-qualify__question-number" aria-hidden="true">
                  03
                </span>
                <span>What type of help are you looking for?</span>
              </legend>
              <div className="ldd-qualify__help-options">
                {HELP_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className="ldd-qualify__help-option"
                    aria-pressed={answers.help === option.id}
                    onClick={() => setAnswer("help", option.id)}
                  >
                    <span className="ldd-qualify__radio" aria-hidden="true" />
                    <span className="ldd-qualify__help-content">
                      <strong className="ldd-qualify__help-title">{option.title}</strong>
                      <span className="ldd-qualify__help-description">{option.body}</span>
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="ldd-qualify__actions">
              <PrimaryButton type="submit" className="ldd-qualify__submit" disabled={!ready}>
                See my options
              </PrimaryButton>
              <p className="ldd-qualify__note">
                No payment required to answer these questions.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}