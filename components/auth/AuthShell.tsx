import Link from "next/link";
import { Brand } from "@/components/marketing/ui/Brand";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="auth-screen">
      <div className="auth-atmosphere" aria-hidden="true" />
      <div className="auth-panel">
        <Brand className="auth-brand" />
        <h1 className="auth-title">{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>
        {children}
      </div>
      <p className="auth-foot">
        <Link href="/">Legal Divorce Docs</Link>
        <span aria-hidden="true"> · </span>
        Arizona document preparation
      </p>
    </main>
  );
}
