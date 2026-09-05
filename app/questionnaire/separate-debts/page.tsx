import { RepeatableSectionPage } from "@/components/questionnaire/RepeatableSectionPage";

export default function SeparateDebtsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  return <RepeatableSectionPage slug="separate-debts" searchParams={searchParams} />;
}
