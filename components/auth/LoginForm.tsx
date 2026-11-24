"use client";

import Link from "next/link";
import { login } from "@/app/auth/actions";
import { AuthPasswordField } from "@/components/auth/AuthPasswordField";
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
        <AuthPasswordField id="password" autoComplete="current-password" />
        <SubmitButton className="btn-primary auth-submit" pendingLabel="Signing in…">
          Log in
        </SubmitButton>
      </form>

      <div className="auth-links">
        <p>
          New here?{" "}
          <Link href="/signup" className="btn-text">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}