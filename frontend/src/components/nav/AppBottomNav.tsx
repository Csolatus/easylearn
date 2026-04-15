"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { NAV_CONFIG } from "./navConfig";

export default function AppBottomNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const role = user?.role ?? "student";
  const config = NAV_CONFIG[role];

  if (!config) return null;

  const visibleItems = config.navItems.slice(0, 4);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0d0d1a] dark:bg-white dark:border-gray-200 border-t border-white/5 flex justify-around items-center py-3 z-50">
      {visibleItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-col items-center gap-1 text-xs transition-colors ${
            pathname === item.href || pathname.startsWith(item.href + "/")
              ? config.accentText
              : "text-gray-500 dark:text-gray-400 hover:text-white dark:hover:text-gray-900"
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
