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

  return (
    <section className="section qualify" id="qualify" aria-labelledby="qualify-heading">
      <div className="section-intro reveal">
        <h2 id="qualify-heading">Find the Right Divorce Package for You</h2>
        <p>Answer a few simple questions about your situation.</p>
      </div>

      <form
        className="qualify-card reveal"
        onSubmit={(event) => {
          event.preventDefault();
          if (!ready) return;
          writeStoredAnswers(answers);
          onComplete(answers);
        }}
      >
        <fieldset className="qualify-step">
          <legend>Do you have children under 18 with your spouse?</legend>
          <div className="choice-row" role="group">
            {["yes", "no"].map((value) => (
              <button
                key={value}
                type="button"
                className={answers.children === value ? "choice active" : "choice"}
                aria-pressed={answers.children === value}
                onClick={() => setAnswer("children", value)}
              >
                {value === "yes" ? "Yes" : "No"}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="qualify-step">
          <legend>Do you and your spouse have property or debts to divide?</legend>
          <div className="choice-row" role="group">
            {["yes", "no"].map((value) => (
              <button
                key={value}
                type="button"
                className={answers.property === value ? "choice active" : "choice"}
                aria-pressed={answers.property === value}
                onClick={() => setAnswer("property", value)}
              >
                {value === "yes" ? "Yes" : "No"}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="qualify-step">
          <legend>What type of help are you looking for?</legend>
          <div className="help-options">
            {HELP_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={answers.help === option.id ? "help-option active" : "help-option"}
                aria-pressed={answers.help === option.id}
                onClick={() => setAnswer("help", option.id)}
              >
                <strong>{option.title}</strong>
                <span>{option.body}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <PrimaryButton className="cta-strong" type="submit" disabled={!ready}>
          See My Options
        </PrimaryButton>
        <p className="qualify-note">No payment required to answer these questions.</p>
      </form>
    </section>
  );
}
