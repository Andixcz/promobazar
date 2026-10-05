import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { OrdersPanel } from "@/components/dashboard/orders-panel";
import { listOrdersForUser } from "@/lib/dashboard/orders-server";
import { requireDashboard } from "@/lib/dashboard/require-dashboard";

export default async function DashboardOrdersPage() {
  const { profile } = await requireDashboard();
  const orders = await listOrdersForUser(profile.userId);

  return (
    <DashboardShell
      title="Objednávky"
      description="Všechny zakázky založené na platformě: stav, protistrana a částka."
    >
      <OrdersPanel orders={orders} memberRole={profile.role} />
    </DashboardShell>
  );
}
