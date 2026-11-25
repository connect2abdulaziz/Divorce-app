import { QuestionnaireHeaderBar } from "@/components/questionnaire/QuestionnaireHeaderBar";
import { QuestionnaireSidebar } from "@/components/questionnaire/QuestionnaireSidebar";
import { QuestionnaireMobileProgress } from "@/components/questionnaire/QuestionnaireMobileProgress";
import { isStaffRole } from "@/lib/admin/current-staff";
import { getCurrentUserAndCase } from "@/lib/questionnaire/current-case";
import { loadCaseBundle } from "@/lib/questionnaire/data";
import { toStepInfo, visibleSteps } from "@/lib/questionnaire/steps";
import { createClient } from "@/lib/supabase/server";
import "../dashboard/dashboard.css";
import "./questionnaire.css";

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
  const showAdmin = isStaffRole((profile as { role?: string } | null)?.role);

  const steps = visibleSteps(gates).map(toStepInfo);

  return (
    <div className="ldd-questionnaire">
      <header className="ldd-dashboard-header ldd-questionnaire-header sticky top-0 z-30 print:hidden">
        <QuestionnaireHeaderBar
          userEmail={user.email ?? ""}
          savedAtLabel={kase.last_saved_at ? formatSavedAt(kase.last_saved_at) : ""}
          hasSavedTimestamp={Boolean(kase.last_saved_at)}
          showAdmin={showAdmin}
        />
        <QuestionnaireMobileProgress steps={steps} />
      </header>

      <main className="ldd-questionnaire__main">
        <div className="ldd-questionnaire__workspace">
          <QuestionnaireSidebar steps={steps} lastCompletedSlug={kase.last_completed_section} />
          <div className="ldd-questionnaire__form">{children}</div>
        </div>
      </main>
    </div>
  );
}