"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createCase,
  getOwnedCase,
  setActiveCaseCookie,
} from "@/lib/cases";
import { getCurrentUser } from "@/lib/questionnaire/current-case";
import { nextStepSlug, visibleSteps } from "@/lib/questionnaire/steps";
import { loadCaseBundle } from "@/lib/questionnaire/data";

export async function startNewQuestionnaire() {
  const user = await getCurrentUser();
  const kase = await createCase(user.id);
  await setActiveCaseCookie(kase.id);
  revalidatePath("/dashboard");
  redirect("/questionnaire");
}

export async function openCase(caseId: string) {
  const user = await getCurrentUser();
  const kase = await getOwnedCase(user.id, caseId);
  if (!kase) redirect("/dashboard");

  await setActiveCaseCookie(kase.id);
  revalidatePath("/dashboard");
  redirect(`/dashboard/${kase.id}`);
}

export async function continueCase(caseId: string) {
  const user = await getCurrentUser();
  const kase = await getOwnedCase(user.id, caseId);
  if (!kase) redirect("/dashboard");

  await setActiveCaseCookie(kase.id);

  if (kase.questionnaire_status !== "in_progress") {
    redirect(`/dashboard/${kase.id}`);
  }

  const { gates } = await loadCaseBundle(kase.id);
  if (!kase.last_completed_section) {
    redirect(`/questionnaire/${visibleSteps(gates)[0].slug}`);
  }

  const next = nextStepSlug(kase.last_completed_section, gates) ?? "review";
  redirect(`/questionnaire/${next}`);
}
