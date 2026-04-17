"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, HelpCircle, LogOut, School } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useSchoolStore } from "@/store/schoolStore";
import { decodeJwtPayload } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";
import { NAV_CONFIG } from "./navConfig";

function getRoleFromCookie(): string {
  if (typeof document === "undefined") return "student";
  try {
    const match = document.cookie.match(/auth_token=([^;]+)/);
    if (!match) return "student";
    return decodeJwtPayload(match[1])?.role ?? "student";
  } catch {
    return "student";
  }
}

export default function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const { schools, activeSchool, setActiveSchool, fetchSchools } = useSchoolStore();

  useEffect(() => { fetchSchools(); }, [fetchSchools]);

  const role = user?.role ?? getRoleFromCookie();
  const config = NAV_CONFIG[role];

  if (!config) return null;

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-surface border-r border-border px-4 py-6 sticky top-0 self-start overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className={`w-8 h-8 ${config.accent} rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0`}>
          E
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">EasyLearn</p>
          <p className="text-xs text-muted">{config.portalLabel}</p>
        </div>
      </div>

      {/* School switcher — teachers only */}
      {role === "teacher" && (
        <div className="mb-4 px-1">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider px-2 mb-1.5">École active</p>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background border border-border">
            <School size={14} className="text-muted shrink-0" />
            <select
              className="flex-1 bg-transparent text-foreground text-xs font-medium focus:outline-none cursor-pointer"
              value={activeSchool?.id ?? ""}
              onChange={(e) => {
                const selected = schools.find((s) => s.id === e.target.value);
                if (selected) setActiveSchool(selected);
              }}
            >
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex flex-col gap-1 flex-1">
        {config.navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
              pathname === item.href || pathname.startsWith(item.href + "/")
                ? `${config.accent} text-white font-medium`
                : "text-muted hover:text-foreground hover:bg-surface"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom links */}
      <div className="flex flex-col gap-1 mt-4">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-danger hover:opacity-80 hover:bg-danger/10 transition-colors w-full text-left"
        >
          <LogOut size={16} /> Déconnexion
        </button>
      </div>

      {/* CTA button */}
      {config.ctaLabel && (
        <Link
          href={config.ctaHref ?? "#"}
          className={`mt-5 w-full text-center ${config.accent} ${config.accentHover} text-white text-sm font-semibold py-2 rounded-xl transition-colors`}
        >
          {config.ctaLabel}
        </Link>
      )}
    </aside>
  );
}
