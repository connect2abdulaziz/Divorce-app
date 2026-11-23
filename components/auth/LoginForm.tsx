"use client";

import Link from "next/link";
import { login } from "@/app/auth/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function LoginForm({ error }: { error?: string }) {
  return (
    <div className="auth-body">
      {error ? <p className="auth-error">{error}</p> : null}

      <form action={login} className="auth-form">
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
            autoComplete="current-password"
          />
        </div>
        <SubmitButton className="btn-primary auth-submit" pendingLabel="Signing in…">
          Log in
        </SubmitButton>
      </form>

      <div className="auth-links">
        <p>
          No account yet?{" "}
          <Link href="/signup" className="btn-text">
            Sign up
          </Link>
        </p>
        <p>
          <Link href="/" className="btn-text">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
