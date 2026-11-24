import { CaseSummary } from "@/components/questionnaire/CaseSummary";
import { FormPanel } from "@/components/questionnaire/FormPanel";
import { buildCaseFillValues } from "@/lib/documents/case-values";
import { validatePacket } from "@/lib/documents/validate-packet";
import { getCurrentUserAndCase } from "@/lib/questionnaire/current-case";
import { loadCaseBundle } from "@/lib/questionnaire/data";
import { ReviewSubmitFooter } from "./ReviewSubmitFooter";

export default async function ReviewPage() {
  const { caseId } = await getCurrentUserAndCase();
  const bundle = await loadCaseBundle(caseId);
  const blockingErrors = validatePacket(buildCaseFillValues(bundle))
    .filter((i) => i.severity === "error")
    .map((i) => i.message);

  return (
    <FormPanel>
      <div className="ldd-q-card-header">
        <div className="ldd-q-card-header__main">
          <h2 className="ldd-q-card-title">Review your answers</h2>
          <p className="ldd-q-card-subtitle">
            Check everything below before submitting. You can jump back to any section to make a
            correction. The information you provide will be used to prepare your divorce documents.
          </p>
        </div>
      </div>

      <div className="ldd-q-card-body ldd-q-card-body--review">
        <CaseSummary caseId={caseId} editHrefFor={(slug) => `/questionnaire/${slug}?from=review`} />
      </div>

      <ReviewSubmitFooter caseId={caseId} blockingErrors={blockingErrors} />
    </FormPanel>
  );
}