import { CaseSummary } from "@/components/questionnaire/CaseSummary";
import { FormPanel } from "@/components/questionnaire/FormPanel";
import { getCurrentUserAndCase } from "@/lib/questionnaire/current-case";
import { ReviewSubmitFooter } from "./ReviewSubmitFooter";

export default async function ReviewPage() {
  const { caseId } = await getCurrentUserAndCase();

  return (
    <FormPanel>
      <div className="border-b border-line/70 px-6 py-7 md:px-8">
        <h2 className="font-serif text-[1.75rem] font-semibold leading-tight text-ink">
          Review your answers
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          Check everything below before submitting. You can jump back to any section to make a
          correction. The information you provide will be used to prepare your divorce documents.
        </p>
      </div>

      <div className="px-6 md:px-8">
        <CaseSummary caseId={caseId} editHrefFor={(slug) => `/questionnaire/${slug}?from=review`} />
      </div>

      <ReviewSubmitFooter caseId={caseId} />
    </FormPanel>
  );
}
