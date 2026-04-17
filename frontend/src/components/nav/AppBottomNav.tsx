"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";
import { NAV_CONFIG } from "./navConfig";

function getRoleFromCookie(): string {
  if (typeof document === "undefined") return "student";
  try {
    const match = document.cookie.match(/auth_token=([^;]+)/);
    if (!match) return "student";
    const payload = JSON.parse(atob(match[1].split(".")[1]));
    return payload.role || "student";
  } catch {
    return "student";
  }
}

export default function AppBottomNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { logout } = useAuth();

  const role = user?.role ?? getRoleFromCookie();
  const config = NAV_CONFIG[role];

  if (!config) return null;

  const visibleItems = config.navItems.slice(0, 4);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex justify-around items-center py-3 z-50">
      {visibleItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-col items-center gap-1 text-xs transition-colors ${
            pathname === item.href || pathname.startsWith(item.href + "/")
              ? config.accentText
              : "text-muted hover:text-foreground"
          }`}
        >
          <item.icon size={20} />
          {item.label}
        </Link>
      ))}
      <button
        onClick={logout}
        className="flex flex-col items-center gap-1 text-xs text-danger hover:opacity-80 transition-opacity"
      >
        <LogOut size={20} />
        Sortir
      </button>
    </nav>
  );
}
