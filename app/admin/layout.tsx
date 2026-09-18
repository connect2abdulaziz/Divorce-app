import Link from "next/link";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { requireStaff } from "@/lib/admin/current-staff";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, role } = await requireStaff();

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-20 border-b border-line/70 bg-white/90 backdrop-blur-md print:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
          <Link href="/admin" className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
            Case Dashboard
          </Link>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="hidden max-w-[18rem] truncate sm:inline">
              {user.email} · {role}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">{children}</main>
    </div>
  );
}
