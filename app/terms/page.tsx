import { PolicyPage } from "@/components/marketing/pages/PolicyPage";
import { getPolicy } from "@/lib/marketing/policies";

const doc = getPolicy("terms")!;

export const metadata = {
  title: `${doc.title} | Legal Divorce Docs`,
  description: doc.summary,
};

export default function TermsRoute() {
  return <PolicyPage doc={doc} />;
}
