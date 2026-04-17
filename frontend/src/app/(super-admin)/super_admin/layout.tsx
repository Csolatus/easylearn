"use client";

import AppSidebar from "@/components/nav/AppSidebar";
import AppBottomNav from "@/components/nav/AppBottomNav";
import AppHeader from "@/components/layout/AppHeader";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-x-hidden">
      <AppSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <AppHeader role="super_admin" />
        <main className="flex-1 pb-16 md:pb-0 overflow-y-auto">{children}</main>
        <AppBottomNav />
      </div>
    </div>
  );
}
