"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useSchoolStore, School } from "@/store/schoolStore";

export default function SuperAdminDashboardPage() {
  const token = useAuthStore((s) => s.token);
  const { schools, fetchSchools } = useSchoolStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetchSchools(token).finally(() => setIsLoading(false));
  }, [token, fetchSchools]);

  const activeSchools = schools.filter((s) => s.is_active !== false);

  return (
    <div className="px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white dark:text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Vue d&apos;ensemble de toutes les écoles
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xl">🏛️</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-400">{schools.length}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Écoles enregistrées</p>
              </div>
            </div>
            <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xl">✅</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">{activeSchools.length}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Écoles actives</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 dark:border-gray-200 bg-[#111118] dark:bg-white overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 dark:border-gray-100">
              <h2 className="text-sm font-semibold text-white dark:text-gray-900">Toutes les écoles</h2>
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
                    {schools.slice(0, 10).map((school: School) => (
                      <tr key={school.id} className="hover:bg-white/5 dark:hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-red-600/20 flex items-center justify-center text-sm">🏛️</div>
                            <span className="font-medium text-white dark:text-gray-900">{school.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400 dark:text-gray-500">
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
        </>
      )}
    </div>
  );
}
