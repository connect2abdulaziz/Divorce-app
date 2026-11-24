import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/SignupForm";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; children?: string; property?: string; help?: string }>;
}) {
  const params = await searchParams;
  const { error, children, property, help } = params;
  const fromQualify = Boolean(children || property || help);
  const backHref =
    fromQualify && (children || property || help)
      ? `/?children=${encodeURIComponent(children ?? "")}&property=${encodeURIComponent(property ?? "")}&help=${encodeURIComponent(help ?? "")}#qualify`
      : "/";

  return (
    <AuthShell
      variant="signup"
      backHref={backHref}
      title="Create your account"
      subtitle={
        fromQualify
          ? "Your package is ready. Review it, then create a secure account to start the questionnaire."
          : "Get started with your Arizona divorce documents."
      }
      visualTitle="Take the next step with confidence."
      visualSubtitle="Get started with a guided Arizona divorce document preparation process."
    >
      <SignupForm
        error={error}
        qualifyChildren={children}
        property={property}
        help={help}
        fromQualify={fromQualify}
      />
    </AuthShell>
  );
}