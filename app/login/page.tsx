import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto max-w-sm px-6 py-24">
      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-navy">
        Legal Divorce Docs
      </p>
      <h1 className="font-serif text-3xl font-semibold text-ink">Log in</h1>
      <p className="mt-2 text-muted">Continue your questionnaire where you left off.</p>
      <LoginForm error={error} />
    </main>
  );
}
