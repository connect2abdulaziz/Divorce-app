"use client";

import Link from "next/link";
import { login } from "@/app/auth/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function LoginForm({ error }: { error?: string }) {
  return (
    <>
      {error ? (
        <p className="mt-6 rounded-sm border border-error/30 bg-error/5 px-3 py-2 text-sm text-error">
          {error}
        </p>
      ) : null}

      <form action={login} className="mt-8 space-y-5">
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
        <SubmitButton pendingLabel="Signing in…">Log in</SubmitButton>
      </form>

      <p className="mt-6 text-sm text-muted">
        No account yet?{" "}
        <Link href="/signup" className="btn-text">
          Sign up
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
