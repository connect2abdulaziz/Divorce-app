import { redirect } from "next/navigation";
import { getCurrentUserAndCase } from "@/lib/questionnaire/current-case";
import { loadCaseBundle } from "@/lib/questionnaire/data";
import { nextStepSlug, visibleSteps } from "@/lib/questionnaire/steps";

// Landing spot after login/signup — sends the client to wherever they left
// off, or the first step if this is a brand new case.
export default async function QuestionnaireIndexPage() {
  const { caseId } = await getCurrentUserAndCase();
  const { kase, gates } = await loadCaseBundle(caseId);

  if (kase.questionnaire_status !== "in_progress") {
    redirect("/questionnaire/submitted");
  }

  if (!kase.last_completed_section) {
    redirect(`/questionnaire/${visibleSteps(gates)[0].slug}`);
  }

  const next = nextStepSlug(kase.last_completed_section, gates) ?? "review";
  redirect(`/questionnaire/${next}`);
}
