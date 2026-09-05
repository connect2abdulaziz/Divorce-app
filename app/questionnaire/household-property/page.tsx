import { RepeatableSectionPage } from "@/components/questionnaire/RepeatableSectionPage";

export default function HouseholdPropertyPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  return <RepeatableSectionPage slug="household-property" searchParams={searchParams} />;
}
