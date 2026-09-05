import Link from "next/link";
import { FormPanel } from "@/components/questionnaire/FormPanel";
import { CaseSummary } from "@/components/questionnaire/CaseSummary";
import { getCurrentUserAndCase } from "@/lib/questionnaire/current-case";

export default async function ReviewPage() {
  const { caseId } = await getCurrentUserAndCase();

  return (
    <FormPanel>
      <div className="border-b border-line/70 px-6 py-7 md:px-8">
        <h2 className="font-serif text-[1.75rem] font-semibold leading-tight text-ink">Review your answers</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          Check everything below before submitting. You can jump back to any section to make a correction.
        </p>
      </div>

      <div className="px-6 md:px-8">
        <CaseSummary caseId={caseId} editHrefFor={(slug) => `/questionnaire/${slug}?from=review`} />
      </div>

      <div className="flex justify-end border-t border-line/70 bg-[#F7F6F1] px-6 py-5 md:px-8">
        <Link href="/questionnaire/submit" className="btn-primary">
          Continue to submit
        </Link>
      </div>
    </FormPanel>
  );
}
