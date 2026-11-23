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
      title="Welcome back"
      subtitle="Sign in to continue your questionnaire where you left off."
    >
      <LoginForm error={error} />
    </AuthShell>
  );
}
