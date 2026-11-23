import { PolicyPage } from "@/components/marketing/pages/PolicyPage";
import { getPolicy } from "@/lib/marketing/policies";

const doc = getPolicy("disclaimer")!;

export const metadata = {
  title: `${doc.title} | Legal Divorce Docs`,
  description: doc.summary,
};

export default function DisclaimerRoute() {
  return <PolicyPage doc={doc} />;
}
