import Sidebar from "@/components/dashboard/Sidebar";
import ProfilePanel from "@/components/dashboard/ProfilePanel";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      {/* 1. Left Navigation Panel */}
      <Sidebar />

      {/* 2. Main Content — page-specific */}
      <main className="flex-1 flex overflow-hidden">
        {children}
      </main>

      {/* 3. Right Profile / Account Panel */}
      <ProfilePanel />
    </div>
  );
}
