import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthShell
      variant="login"
      backHref="/"
      title="Welcome back"
      subtitle="Sign in to continue your divorce questionnaire."
      visualTitle="A clearer path forward."
      visualSubtitle="Continue your Arizona divorce document preparation at your own pace."
    >
      <LoginForm error={error} />
    </AuthShell>
  );
}