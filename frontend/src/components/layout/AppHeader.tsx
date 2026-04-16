"use client";

import { useAuthStore } from "@/store/authStore";

type Role = "student" | "teacher" | "school_admin" | "super_admin";

type AccentConfig = {
  ring: string;
  dot: string;
  avatar: string;
  placeholder: string;
};

const ACCENT: Record<Role, AccentConfig> = {
  student: {
    ring: "focus:ring-purple-500",
    dot: "bg-purple-500",
    avatar: "bg-purple-600",
    placeholder: "Rechercher un cours...",
  },
  teacher: {
    ring: "focus:ring-green-500",
    dot: "bg-green-500",
    avatar: "bg-green-600",
    placeholder: "Rechercher...",
  },
  school_admin: {
    ring: "focus:ring-orange-500",
    dot: "bg-orange-500",
    avatar: "bg-orange-600",
    placeholder: "Rechercher...",
  },
  super_admin: {
    ring: "focus:ring-red-500",
    dot: "bg-red-500",
    avatar: "bg-red-600",
    placeholder: "Rechercher...",
  },
};

type Props = {
  role: Role;
};

export default function AppHeader({ role }: Props) {
  const { user } = useAuthStore();
  const accent = ACCENT[role];
  const initial = user?.first_name?.[0]?.toUpperCase() ?? "?";

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 dark:border-gray-200 bg-[#0f0f1a] dark:bg-white sticky top-0 z-40">
      <div className="relative w-full max-w-xs">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder={accent.placeholder}
          className={`w-full bg-[#1a1a2e] dark:bg-gray-100 text-white dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-400 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 ${accent.ring}`}
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="relative text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900 transition-colors">
          🔔
          <span className={`absolute -top-1 -right-1 w-2 h-2 ${accent.dot} rounded-full`} />
        </button>
        <div className={`w-8 h-8 rounded-full ${accent.avatar} flex items-center justify-center text-sm font-bold text-white`}>
          {initial}
        </div>
      </div>
    </header>
  );
}
