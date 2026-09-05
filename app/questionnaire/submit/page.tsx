import { getCurrentUserAndCase } from "@/lib/questionnaire/current-case";
import { SubmitForm } from "./Form";

export default async function SubmitPage() {
  const { caseId } = await getCurrentUserAndCase();
  return <SubmitForm caseId={caseId} />;
}
