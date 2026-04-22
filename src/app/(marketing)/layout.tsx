import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Background ambient gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />
      
      <Navbar />
      <main className="flex-1 w-full pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
