import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64 relative">
        {/* Ambient background for dashboard area */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
        
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 z-10">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
