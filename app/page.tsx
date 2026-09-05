import Link from "next/link";
import { login } from "@/app/auth/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto max-w-sm px-6 py-24">
      <h1 className="font-serif text-3xl font-semibold text-ink">Log in</h1>
      <p className="mt-2 text-muted">Continue your questionnaire where you left off.</p>

      {error && (
        <p className="mt-6 rounded-sm border border-error/30 bg-error/5 px-3 py-2 text-sm text-error">
          {error}
        </p>
      )}

      <form action={login} className="mt-8 space-y-5">
        <div>
          <label className="field-label" htmlFor="email">Email</label>
          <input className="field-input" id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <label className="field-label" htmlFor="password">Password</label>
          <input className="field-input" id="password" name="password" type="password" required autoComplete="current-password" />
        </div>
        <button type="submit" className="btn-primary w-full">Log in</button>
      </form>

      <p className="mt-6 text-sm text-muted">
        No account yet? <Link href="/signup" className="btn-text">Sign up</Link>
      </p>
    </main>
  );
}
