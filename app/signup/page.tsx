import { SignupForm } from "@/components/auth/SignupForm";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; children?: string; property?: string; help?: string }>;
}) {
  const params = await searchParams;
  const { error, children, property, help } = params;
  const fromQualify = Boolean(children || property || help);

  return (
    <main className="mx-auto max-w-sm px-6 py-24">
      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-navy">
        Legal Divorce Docs
      </p>
      <h1 className="font-serif text-3xl font-semibold text-ink">Create your account</h1>
      <p className="mt-2 text-muted">
        {fromQualify
          ? "Your package answers are ready. Create an account to start the secure questionnaire."
          : "Enter your details to create an account. You'll be signed in and taken to the questionnaire right away."}
      </p>
      <SignupForm
        error={error}
        qualifyChildren={children}
        property={property}
        help={help}
        fromQualify={fromQualify}
      />
    </main>
  );
}
