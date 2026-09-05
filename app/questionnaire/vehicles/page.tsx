import { RepeatableSectionPage } from "@/components/questionnaire/RepeatableSectionPage";

export default function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  return <RepeatableSectionPage slug="vehicles" searchParams={searchParams} />;
}
