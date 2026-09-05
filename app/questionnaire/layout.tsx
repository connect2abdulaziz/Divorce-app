import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import { ProgressRailWithPath } from "@/components/questionnaire/ProgressRailWithPath";
import { isStaffRole } from "@/lib/admin/current-staff";
import { getCurrentUserAndCase } from "@/lib/questionnaire/current-case";
import { loadCaseBundle } from "@/lib/questionnaire/data";
import { percentComplete, toStepInfo, visibleSteps } from "@/lib/questionnaire/steps";
import { createClient } from "@/lib/supabase/server";

function formatSavedAt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function QuestionnaireLayout({ children }: { children: React.ReactNode }) {
  const { user, caseId } = await getCurrentUserAndCase();
  const { kase, gates } = await loadCaseBundle(caseId);
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const showDashboard = isStaffRole((profile as { role?: string } | null)?.role);

  const steps = visibleSteps(gates).map(toStepInfo);
  const percent = percentComplete(gates, kase.last_completed_section);

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-20 border-b border-line/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
            Divorce questionnaire
          </p>
          <div className="flex items-center gap-3 text-sm text-muted sm:gap-4">
            {showDashboard && (
              <Link href="/admin" className="btn-text">
                Dashboard
              </Link>
            )}
            <span className="hidden max-w-[14rem] truncate sm:inline">{user.email}</span>
            <span className="hidden md:inline">Saved {formatSavedAt(kase.last_saved_at)}</span>
            <form action={signOut}>
              <button type="submit" className="btn-text">
                Sign out
              </button>
            </form>
          </div>
        </div>

        <ProgressRailWithPath
          steps={steps}
          lastCompletedSlug={kase.last_completed_section}
          percent={percent}
        />
      </header>

      <main className="mx-auto max-w-3xl px-5 py-8 md:px-8 md:py-12">{children}</main>
    </div>
  );
}
