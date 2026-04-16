"use client";

import { useAuthStore } from "@/store/authStore";
import NotificationBell from "./NotificationBell";

type Props = {
  searchPlaceholder?: string;
  accentColor?: "purple" | "green" | "blue" | "orange" | "red";
  notificationCount?: number;
  onNotificationClick?: () => void;
};

const RING_COLORS: Record<NonNullable<Props["accentColor"]>, string> = {
  purple: "focus:ring-purple-500",
  green: "focus:ring-green-500",
  blue: "focus:ring-blue-500",
  orange: "focus:ring-orange-500",
  red: "focus:ring-red-500",
};

const AVATAR_COLORS: Record<NonNullable<Props["accentColor"]>, string> = {
  purple: "bg-purple-600",
  green: "bg-green-600",
  blue: "bg-blue-600",
  orange: "bg-orange-600",
  red: "bg-red-600",
};

export default function Navbar({
  searchPlaceholder = "Rechercher...",
  accentColor = "purple",
  notificationCount = 1,
  onNotificationClick,
}: Props) {
  const { user } = useAuthStore();
  const initial = user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 dark:border-gray-200 bg-[#0f0f1a] dark:bg-white sticky top-0 z-40">
      {/* Search */}
      <div className="relative w-full max-w-xs">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">
          🔍
        </span>
        <input
          type="text"
          placeholder={searchPlaceholder}
          className={`w-full bg-[#1a1a2e] dark:bg-gray-100 text-white dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-400 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 ${RING_COLORS[accentColor]}`}
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <NotificationBell
          count={notificationCount}
          accentColor={accentColor}
          onClick={onNotificationClick}
        />
        <div
          className={`w-8 h-8 rounded-full ${AVATAR_COLORS[accentColor]} flex items-center justify-center text-sm font-bold text-white`}
        >
          {initial}
        </div>
      </div>
    </header>
  );
}
