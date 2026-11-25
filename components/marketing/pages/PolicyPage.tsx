import type { PolicyDoc } from "@/lib/marketing/policies";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { LegalPageLayout } from "@/components/marketing/legal/LegalPageLayout";

export function PolicyPage({ doc }: { doc: PolicyDoc }) {
  return (
    <MarketingShell>
      <LegalPageLayout doc={doc} />
    </MarketingShell>
  );
}