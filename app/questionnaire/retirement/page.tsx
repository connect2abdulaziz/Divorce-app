import { RepeatableSectionPage } from "@/components/questionnaire/RepeatableSectionPage";

export default function RetirementPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  return <RepeatableSectionPage slug="retirement" searchParams={searchParams} />;
}
