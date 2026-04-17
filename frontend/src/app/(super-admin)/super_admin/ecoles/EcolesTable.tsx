"use client";

import { Landmark } from "lucide-react";
import type { School } from "@/types/api";

interface Props {
  filtered: School[];
  suspending: string | null;
  onSuspend: (school: School) => void;
}

export function EcolesTable({ filtered, suspending, onSuspend }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 dark:border-gray-300 bg-[#111118] dark:bg-white shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10 dark:border-gray-200 bg-white/5 dark:bg-gray-50 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white dark:text-gray-900">
          {filtered.length} école{filtered.length > 1 ? "s" : ""}
        </h2>
      </div>

      {filtered.length === 0 ? (
        <p className="px-6 py-8 text-center text-sm text-gray-500">Aucune école trouvée.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 dark:border-gray-200">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">École</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Créée le</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 dark:divide-gray-200">
              {filtered.map((school) => (
                <tr key={school.id} className="hover:bg-white/5 dark:hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-600/20 flex items-center justify-center text-red-400 shrink-0"><Landmark size={14} /></div>
                      <div>
                        <p className="font-medium text-white dark:text-gray-900">{school.name}</p>
                        {school.email && (
                          <p className="text-xs text-gray-500 mt-0.5">{school.email}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 dark:text-gray-500">
                    {school.created_at ? new Date(school.created_at).toLocaleDateString("fr-FR") : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      school.is_active
                        ? "bg-green-500/10 text-green-400 dark:text-green-600"
                        : "bg-red-500/10 text-red-400 dark:text-red-600"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${school.is_active ? "bg-green-400" : "bg-red-400"}`} />
                      {school.is_active ? "Active" : "Suspendue"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {school.is_active && (
                      <button
                        onClick={() => onSuspend(school)}
                        disabled={suspending === school.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {suspending === school.id ? "…" : "Suspendre"}
                      </button>
                    )}
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
