"use client";

import AppSidebar from "@/components/nav/AppSidebar";
import AppBottomNav from "@/components/nav/AppBottomNav";

function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 dark:border-gray-200 bg-[#0f0f1a] dark:bg-white sticky top-0 z-40">
      <div className="relative w-full max-w-xs">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Rechercher..."
          className="w-full bg-[#1a1a2e] dark:bg-gray-100 text-white dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-400 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="relative text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900 transition-colors">
          🔔
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-sm font-bold text-white">
          T
        </div>
      </div>
    </header>
  );
}

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0f0f1a] dark:bg-gray-50 text-white dark:text-gray-900 overflow-x-hidden">
      <AppSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar />
        <main className="flex-1 pb-16 md:pb-0 overflow-y-auto">{children}</main>
        <AppBottomNav />
      </div>
    </div>
  );
}
