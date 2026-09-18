"use client";
// @ts-nocheck

import { useEffect, useState } from 'react';
import { HELP_OPTIONS } from '@/lib/marketing/content';
import { PrimaryButton } from '../ui/PrimaryButton';

const initialAnswers: {
  children: string | null;
  property: string | null;
  help: string | null;
} = {
  children: null,
  property: null,
  help: null,
};

export function QualificationSection({
  onComplete,
  presetHelp = null,
  loading = false,
}: {
  onComplete: (answers: { children: string | null; property: string | null; help: string | null }) => void;
  presetHelp?: string | null;
  loading?: boolean;
}) {
  const [answers, setAnswers] = useState(initialAnswers);

  useEffect(() => {
    if (!presetHelp) return;
    setAnswers((prev) => ({ ...prev, help: presetHelp }));
  }, [presetHelp]);

  const ready =
    answers.children !== null && answers.property !== null && answers.help !== null;

  const setAnswer = (key: "children" | "property" | "help", value: string) => {
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
          onComplete(answers);
        }}
      >
        <fieldset className="qualify-step">
          <legend>Do you have children under 18 with your spouse?</legend>
          <div className="choice-row" role="group">
            {['yes', 'no'].map((value) => (
              <button
                key={value}
                type="button"
                className={answers.children === value ? 'choice active' : 'choice'}
                aria-pressed={answers.children === value}
                onClick={() => setAnswer('children', value)}
              >
                {value === 'yes' ? 'Yes' : 'No'}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="qualify-step">
          <legend>Do you and your spouse have property or debts to divide?</legend>
          <div className="choice-row" role="group">
            {['yes', 'no'].map((value) => (
              <button
                key={value}
                type="button"
                className={answers.property === value ? 'choice active' : 'choice'}
                aria-pressed={answers.property === value}
                onClick={() => setAnswer('property', value)}
              >
                {value === 'yes' ? 'Yes' : 'No'}
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
                className={answers.help === option.id ? 'help-option active' : 'help-option'}
                aria-pressed={answers.help === option.id}
                onClick={() => setAnswer('help', option.id)}
              >
                <strong>{option.title}</strong>
                <span>{option.body}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <PrimaryButton
          className="cta-strong"
          type="submit"
          disabled={!ready}
          loading={loading}
          loadingLabel="Continuing…"
        >
          See My Options
        </PrimaryButton>
        <p className="qualify-note">No payment required to answer these questions.</p>
      </form>
    </section>
  );
}
