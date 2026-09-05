import { FormPanel } from "@/components/questionnaire/FormPanel";

export default function SubmittedPage() {
  return (
    <FormPanel>
      <div className="px-6 py-8 md:px-8 md:py-10">
        <h2 className="font-serif text-[1.75rem] font-semibold leading-tight text-ink">
          Questionnaire Submitted
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink">
          Your information has been received and will be used to prepare your
          divorce documents. Your attorney&apos;s office will be in touch if
          anything further is needed.
        </p>
      </div>
    </FormPanel>
  );
}
