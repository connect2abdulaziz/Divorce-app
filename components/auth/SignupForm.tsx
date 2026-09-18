"use client";

import Link from "next/link";
import { signup } from "@/app/auth/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function SignupForm({
  error,
  qualifyChildren,
  property,
  help,
  fromQualify,
}: {
  error?: string;
  qualifyChildren?: string;
  property?: string;
  help?: string;
  fromQualify?: boolean;
}) {
  return (
    <>
      {error ? (
        <p className="mt-6 rounded-sm border border-error/30 bg-error/5 px-3 py-2 text-sm text-error">
          {error}
        </p>
      ) : null}

      <form action={signup} className="mt-8 space-y-5">
        {qualifyChildren ? (
          <input type="hidden" name="qualify_children" value={qualifyChildren} />
        ) : null}
        {property ? <input type="hidden" name="qualify_property" value={property} /> : null}
        {help ? <input type="hidden" name="qualify_help" value={help} /> : null}
        <div>
          <label className="field-label" htmlFor="full_name">
            Full name
          </label>
          <input
            className="field-input"
            id="full_name"
            name="full_name"
            type="text"
            required
            autoComplete="name"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="email">
            Email
          </label>
          <input
            className="field-input"
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="password">
            Password
          </label>
          <input
            className="field-input"
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
          <p className="field-hint">At least 8 characters.</p>
        </div>
        <SubmitButton pendingLabel="Creating account…">Sign up</SubmitButton>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="btn-text">
          Log in
        </Link>
      </p>
      <p className="mt-4 text-sm text-muted">
        <Link href="/" className="btn-text">
          Back to home
        </Link>
      </p>
    </>
  );
}
