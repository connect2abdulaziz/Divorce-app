import Link from "next/link";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { isStaffRole } from "@/lib/admin/current-staff";
import { getCurrentUser } from "@/lib/questionnaire/current-case";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  if (isStaffRole((profile as { role?: string } | null)?.role)) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-20 border-b border-line/70 bg-white/95 backdrop-blur-md print:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Link
            href="/dashboard"
            className="text-[11px] font-medium uppercase tracking-[0.16em] text-navy hover:text-accent"
          >
            Legal Divorce Docs
          </Link>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="hidden max-w-[16rem] truncate sm:inline">{user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-10 md:px-8 md:py-14">{children}</main>
    </div>
  );
}
