"use client";

import Link from "next/link";
import { useState } from "react";
import { signup } from "@/app/auth/actions";
import { AuthPasswordField } from "@/components/auth/AuthPasswordField";
import { FOOTER_LEGAL, packageForHelp } from "@/lib/marketing/content";
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
  const [policiesAccepted, setPoliciesAccepted] = useState(false);
  const recommended = fromQualify ? packageForHelp(help) : null;
  return (
    <div className="auth-body">
      {error ? <p className="auth-error">{error}</p> : null}

      {recommended ? (
        <div className="auth-package" aria-label="Selected package">
          <div className="auth-package-copy">
            <p className="auth-package-kicker">Selected package</p>
            <p className="auth-package-name">{recommended.name}</p>
            <p className="auth-package-blurb">{recommended.blurb}</p>
          </div>
          <p className="auth-package-price">{recommended.price}</p>
        </div>
      ) : null}

      <form action={signup} className="auth-form">
        {qualifyChildren ? (
          <input type="hidden" name="qualify_children" value={qualifyChildren} />
        ) : null}
        {property ? <input type="hidden" name="qualify_property" value={property} /> : null}
        {help ? <input type="hidden" name="qualify_help" value={help} /> : null}
        {recommended ? <input type="hidden" name="qualify_package" value={recommended.id} /> : null}

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
        <AuthPasswordField
          id="password"
          autoComplete="new-password"
          minLength={8}
          hint="At least 8 characters."
        />

        <label className="auth-policy-check">
          <input
            type="checkbox"
            name="policies_accepted"
            value="true"
            required
            checked={policiesAccepted}
            onChange={(event) => setPoliciesAccepted(event.target.checked)}
          />
          <span>
            I have read and agree to the{" "}
            {FOOTER_LEGAL.map((link, index) => (
              <span key={link.href}>
                {index > 0 ? (index === FOOTER_LEGAL.length - 1 ? ", and " : ", ") : null}
                <Link href={link.href} className="btn-text" target="_blank" rel="noreferrer">
                  {link.label}
                </Link>
              </span>
            ))}
            .
          </span>
        </label>

        <SubmitButton
          className="btn-primary auth-submit"
          pendingLabel="Creating account…"
          disabled={!policiesAccepted}
        >
          Create account
        </SubmitButton>
      </form>

      <div className="auth-links">
        <p>
          Already have an account?{" "}
          <Link href="/login" className="btn-text">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}