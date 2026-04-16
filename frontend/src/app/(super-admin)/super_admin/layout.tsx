"use client";

import AppSidebar from "@/components/nav/AppSidebar";
import AppBottomNav from "@/components/nav/AppBottomNav";
import Navbar from "@/components/layout/Navbar";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0f0f1a] dark:bg-gray-50 text-white dark:text-gray-900 overflow-x-hidden">
      <AppSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar accentColor="red" searchPlaceholder="Rechercher..." />
        <main className="flex-1 pb-16 md:pb-0 overflow-y-auto">{children}</main>
        <AppBottomNav />
      </div>
    </div>
  );
}
