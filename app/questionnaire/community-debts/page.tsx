import { RepeatableSectionPage } from "@/components/questionnaire/RepeatableSectionPage";

export default function CommunityDebtsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  return <RepeatableSectionPage slug="community-debts" searchParams={searchParams} />;
}
