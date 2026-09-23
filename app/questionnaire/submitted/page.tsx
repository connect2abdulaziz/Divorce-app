import { redirect } from "next/navigation";
import { getCurrentUserAndCase } from "@/lib/questionnaire/current-case";

/** Confirmation UI now lives on the client dashboard case page. */
export default async function SubmittedPage() {
  const { caseId } = await getCurrentUserAndCase();
  redirect(`/dashboard/${caseId}`);
}
