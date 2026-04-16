"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useSchoolStore, School } from "@/store/schoolStore";

export default function EcolesPage() {
  const token = useAuthStore((s) => s.token);
  const { schools, fetchSchools } = useSchoolStore();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetchSchools(token).finally(() => setIsLoading(false));
  }, [token, fetchSchools]);

  const filtered = schools.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f0f1a] dark:bg-gray-50 px-8 py-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white dark:text-gray-900">Écoles</h1>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              {isLoading ? "Chargement…" : `${schools.length} établissement${schools.length > 1 ? "s" : ""} enregistré${schools.length > 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        <div className="relative w-full max-w-sm">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a2e] dark:bg-white dark:text-gray-900 dark:shadow-sm text-white placeholder-gray-500 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && (
          <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6">
            {filtered.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-8">Aucune école trouvée.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 dark:text-gray-500 text-xs border-b border-white/5 dark:border-gray-200">
                      <th className="text-left pb-3 font-medium">École</th>
                      <th className="text-left pb-3 font-medium">Créée le</th>
                      <th className="text-left pb-3 font-medium">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 dark:divide-gray-100">
                    {filtered.map((school: School) => (
                      <tr key={school.id} className="text-xs">
                        <td className="py-3 text-white dark:text-gray-900 font-medium">{school.name}</td>
                        <td className="py-3 text-gray-400 dark:text-gray-500">
                          {school.created_at ? new Date(school.created_at).toLocaleDateString("fr-FR") : "—"}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full font-medium ${
                            school.is_active !== false
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}>
                            {school.is_active !== false ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
