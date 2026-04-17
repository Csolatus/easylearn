"use client";

import { SearchFieldRoot, SearchFieldGroup, SearchFieldSearchIcon, SearchFieldInput } from "@heroui/react";
import { useAuthStore } from "@/store/authStore";

type Role = "student" | "teacher" | "school_admin" | "super_admin";

const PLACEHOLDERS: Record<Role, string> = {
  student:     "Rechercher un cours...",
  teacher:     "Rechercher...",
  school_admin: "Rechercher...",
  super_admin: "Rechercher...",
};

const AVATAR_COLORS: Record<Role, string> = {
  student:     "bg-purple-600",
  teacher:     "bg-green-600",
  school_admin: "bg-orange-600",
  super_admin: "bg-red-600",
};

type Props = {
  role: Role;
};

export default function AppHeader({ role }: Props) {
  const { user } = useAuthStore();
  const initial = user?.first_name?.[0]?.toUpperCase() ?? "?";

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background sticky top-0 z-40">
      <SearchFieldRoot className="w-full max-w-xs">
        <SearchFieldGroup>
          <SearchFieldSearchIcon />
          <SearchFieldInput placeholder={PLACEHOLDERS[role]} />
        </SearchFieldGroup>
      </SearchFieldRoot>
      <div className="flex items-center gap-4">
        <button className="relative text-muted hover:text-foreground transition-colors p-1">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
        </button>
        <div className={`w-8 h-8 rounded-full ${AVATAR_COLORS[role]} flex items-center justify-center text-sm font-bold text-white`}>
          {initial}
        </div>
      </div>
    </header>
  );
}
