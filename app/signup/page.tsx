import Link from "next/link";
import { signup } from "@/app/auth/actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto max-w-sm px-6 py-24">
      <h1 className="font-serif text-3xl font-semibold text-ink">Create your account</h1>
      <p className="mt-2 text-muted">
        Your case and questionnaire start automatically once you sign in. You
        can save your progress and come back anytime.
      </p>

      {error && (
        <p className="mt-6 rounded-sm border border-error/30 bg-error/5 px-3 py-2 text-sm text-error">
          {error}
        </p>
      )}

      <form action={signup} className="mt-8 space-y-5">
        <div>
          <label className="field-label" htmlFor="full_name">Full name</label>
          <input className="field-input" id="full_name" name="full_name" type="text" required autoComplete="name" />
        </div>
        <div>
          <label className="field-label" htmlFor="email">Email</label>
          <input className="field-input" id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <label className="field-label" htmlFor="password">Password</label>
          <input className="field-input" id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
          <p className="field-hint">At least 8 characters.</p>
        </div>
        <button type="submit" className="btn-primary w-full">Sign up</button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already have an account? <Link href="/login" className="btn-text">Log in</Link>
      </p>
    </main>
  );
}
