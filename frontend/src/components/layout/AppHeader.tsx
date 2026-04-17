"use client";

import { Bell, Search } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import ThemeToggle from "@/components/ui/ThemeToggle";

type Role = "student" | "teacher" | "school_admin" | "super_admin";

const PLACEHOLDERS: Record<Role, string> = {
  student:      "Rechercher un cours...",
  teacher:      "Rechercher...",
  school_admin: "Rechercher...",
  super_admin:  "Rechercher...",
};

const AVATAR_COLORS: Record<Role, string> = {
  student:      "bg-purple-600",
  teacher:      "bg-green-600",
  school_admin: "bg-orange-600",
  super_admin:  "bg-red-600",
};

type Props = {
  role: Role;
};

export default function AppHeader({ role }: Props) {
  const { user } = useAuthStore();
  const initial = user?.first_name?.[0]?.toUpperCase() ?? "?";

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background sticky top-0 z-40">
      <div className="relative w-full max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="search"
          placeholder={PLACEHOLDERS[role]}
          className="w-full bg-surface border border-white/10 text-foreground placeholder-gray-500 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="relative text-muted hover:text-foreground transition-colors p-1">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
        </button>
        <ThemeToggle />
        <div className={`w-8 h-8 rounded-full ${AVATAR_COLORS[role]} flex items-center justify-center text-sm font-bold text-white`}>
          {initial}
        </div>
      </div>
    </header>
  );
}
