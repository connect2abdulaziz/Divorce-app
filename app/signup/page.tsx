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

  return (
    <AuthShell
      title="Create your account"
      subtitle={
        fromQualify
          ? "Your package is ready. Review it, then create a secure account to start the questionnaire."
          : "Create a secure account to start your Arizona divorce document questionnaire."
      }
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
