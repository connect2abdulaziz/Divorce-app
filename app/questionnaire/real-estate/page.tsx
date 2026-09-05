import { RepeatableSectionPage } from "@/components/questionnaire/RepeatableSectionPage";

export default function RealEstatePage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  return <RepeatableSectionPage slug="real-estate" searchParams={searchParams} />;
}
