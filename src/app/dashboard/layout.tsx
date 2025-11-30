import { DashboardNav } from "@/components/dashboard-nav";
import { VerificationProvider } from "@/hooks/use-verification";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | VaSa",
  description: "Her Dreams, Our Mission!",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <VerificationProvider>
        <DashboardNav />
        <main className="flex flex-1 flex-col gap-4 bg-muted/40 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </VerificationProvider>
    </div>
  );
}
