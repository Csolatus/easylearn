"use client";

import Link from "next/link";
import { Landmark } from "lucide-react";
import type { School } from "@/store/schoolStore";

interface Props {
  schools: School[];
}

export function RecentSchoolsTable({ schools }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 dark:border-gray-100">
        <h2 className="text-sm font-semibold text-foreground">Toutes les écoles</h2>
        <Link href="/super_admin/ecoles" className="text-xs text-red-400 hover:text-red-300 transition-colors font-medium">
          Voir tout →
        </Link>
      </div>

      {schools.length === 0 ? (
        <p className="px-6 py-8 text-center text-sm text-gray-500">Aucune école enregistrée.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 dark:border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">École</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Créée le</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 dark:divide-gray-100">
              {schools.slice(0, 10).map((school) => (
                <tr key={school.id} className="hover:bg-white/5 dark:hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-600/20 flex items-center justify-center text-sm">🏛️</div>
                      <span className="font-medium text-foreground">{school.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted">
                    {school.created_at ? new Date(school.created_at).toLocaleDateString("fr-FR") : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      school.is_active !== false
                        ? "bg-green-500/10 text-green-400 dark:text-green-600"
                        : "bg-red-500/10 text-red-400 dark:text-red-600"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${school.is_active !== false ? "bg-green-400" : "bg-red-400"}`} />
                      {school.is_active !== false ? "Actif" : "Inactif"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
