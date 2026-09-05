import { RepeatableSectionPage } from "@/components/questionnaire/RepeatableSectionPage";

export default function SeparatePropertyPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  return <RepeatableSectionPage slug="separate-property" searchParams={searchParams} />;
}
