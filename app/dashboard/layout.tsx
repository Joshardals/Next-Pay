import { LeftSide } from "../_components/Dashboard/LeftSide";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen overflow-hidden">
      <LeftSide />
      <div className="flex-1 ml-0 lg:ml-64 p-4 md:p-6 overflow-x-hidden">
        {children}
      </div>
    </main>
  );
}
