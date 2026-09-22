import { DashboardBodyChrome } from "@/components/dashboard/dashboard-body-chrome";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardBodyChrome />
      {children}
    </>
  );
}
