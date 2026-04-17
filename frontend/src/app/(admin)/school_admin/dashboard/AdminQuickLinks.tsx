"use client";

import Link from "next/link";
import { UserRound, Library } from "lucide-react";

export function AdminQuickLinks() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Link
        href="/school_admin/professeurs"
        className="rounded-2xl border border-border bg-surface shadow-md p-6 flex items-center gap-4 hover:ring-2 hover:ring-orange-500/50 transition-all"
      >
        <div className="w-12 h-12 rounded-xl bg-orange-600/20 flex items-center justify-center text-orange-400">
          <UserRound size={24} />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Gérer les professeurs</p>
          <p className="text-xs text-gray-400 mt-0.5">Inviter, suspendre, retirer</p>
        </div>
      </Link>
      <Link
        href="/school_admin/catalogue"
        className="rounded-2xl border border-border bg-surface shadow-md p-6 flex items-center gap-4 hover:ring-2 hover:ring-orange-500/50 transition-all"
      >
        <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center text-purple-400">
          <Library size={24} />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Catalogue de cours</p>
          <p className="text-xs text-gray-400 mt-0.5">Gérer l&apos;accès aux cours</p>
        </div>
      </Link>
    </div>
  );
}
