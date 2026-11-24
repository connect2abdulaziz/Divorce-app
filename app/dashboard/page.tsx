import { ClientDashboard } from "@/components/dashboard/ClientDashboard";
import { toDashboardCaseItem } from "@/lib/dashboard/present";
import { listClientCases } from "@/lib/cases";
import { getCurrentUser } from "@/lib/questionnaire/current-case";

export default async function ClientDashboardPage() {
  const user = await getCurrentUser();
  const cases = await listClientCases(user.id);
  const items = cases.map(toDashboardCaseItem);

  return <ClientDashboard items={items} />;
}