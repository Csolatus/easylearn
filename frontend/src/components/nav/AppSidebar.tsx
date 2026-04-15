"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useSchoolStore } from "@/store/schoolStore";
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

export default function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { schools, activeSchool, setActiveSchool } = useSchoolStore();

  const role = user?.role ?? getRoleFromCookie();
  const config = NAV_CONFIG[role];

  if (!config) return null;

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-[#0d0d1a] dark:bg-white dark:border-gray-200 px-4 py-6 border-r border-white/5 sticky top-0 self-start overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className={`w-8 h-8 ${config.accent} rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0`}>
          E
        </div>
        <div>
          <p className="text-sm font-semibold text-white dark:text-gray-900">EasyLearn</p>
          <p className="text-xs text-gray-500">{config.portalLabel}</p>
        </div>
      </div>

      {/* School switcher — teachers only */}
      {role === "teacher" && (
        <div className="mb-4 px-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-1.5">École active</p>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 dark:bg-gray-100 border border-white/10 dark:border-gray-200">
            <span className="text-xs">🏫</span>
            <select
              className="flex-1 bg-transparent text-white dark:text-gray-900 text-xs font-medium focus:outline-none cursor-pointer"
              value={activeSchool?.id ?? ""}
              onChange={(e) => {
                const selected = schools.find((s) => s.id === e.target.value);
                if (selected) setActiveSchool(selected);
              }}
            >
              {schools.map((school) => (
                <option
                  key={school.id}
                  value={school.id}
                  className="bg-[#0d0d1a] dark:bg-white text-white dark:text-gray-900"
                >
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
                : "text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900 hover:bg-white/5 dark:hover:bg-gray-100"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom links */}
      <div className="flex flex-col gap-1 mt-4">
        <Link
          href={`/${role}/settings`}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900 hover:bg-white/5 dark:hover:bg-gray-100 transition-colors"
        >
          <span>⚙️</span> Settings
        </Link>
        <Link
          href={`/${role}/help`}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900 hover:bg-white/5 dark:hover:bg-gray-100 transition-colors"
        >
          <span>❓</span> Help
        </Link>
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
