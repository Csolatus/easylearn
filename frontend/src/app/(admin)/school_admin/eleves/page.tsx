"use client";

import { useState } from "react";

const FILTERS = ["Tous", "Actif", "Inactif"];

const MOCK_STUDENTS = [
  { id: 1, name: "Lucas Martin", email: "lucas.martin@email.com", cours: 5, progression: 72, statut: "Actif" },
  { id: 2, name: "Emma Blanc", email: "emma.blanc@email.com", cours: 3, progression: 45, statut: "Inactif" },
  { id: 3, name: "Noah Garcia", email: "noah.garcia@email.com", cours: 8, progression: 88, statut: "Actif" },
  { id: 4, name: "Léa Dubois", email: "lea.dubois@email.com", cours: 2, progression: 30, statut: "Actif" },
  { id: 5, name: "Thomas Leroy", email: "thomas.leroy@email.com", cours: 6, progression: 60, statut: "Inactif" },
  { id: 6, name: "Camille Petit", email: "camille.petit@email.com", cours: 4, progression: 55, statut: "Actif" },
];

export default function ElevesPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");

  const filtered = MOCK_STUDENTS.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === "Tous" || s.statut === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white dark:text-gray-900">Élèves</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Gérez les élèves de votre école
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Rechercher un élève..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111118] dark:bg-white border-2 border-white/10 dark:border-gray-400 text-white dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-400 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-md"
          />
        </div>
        <div className="flex gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? "bg-orange-600 text-white"
                  : "bg-white/5 dark:bg-gray-100 text-gray-400 dark:text-gray-600 hover:bg-white/10 dark:hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 dark:border-gray-300 bg-[#111118] dark:bg-white shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 dark:border-gray-200 bg-white/5 dark:bg-gray-50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white dark:text-gray-900">
            {filtered.length} élève{filtered.length > 1 ? "s" : ""}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 dark:border-gray-200">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Élève</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cours</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Progression</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 dark:divide-gray-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                    Aucun élève trouvé.
                  </td>
                </tr>
              ) : (
                filtered.map((student) => (
                  <tr key={student.id} className="hover:bg-white/5 dark:hover:bg-gray-100 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-600/20 flex items-center justify-center text-sm font-bold text-orange-400">
                          {student.name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-white dark:text-gray-900">{student.name}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300 dark:text-gray-700 font-medium">{student.cours}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-white/10 dark:bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: `${student.progression}%` }} />
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{student.progression}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        student.statut === "Actif"
                          ? "bg-green-500/10 text-green-400 dark:text-green-600"
                          : "bg-red-500/10 text-red-400 dark:text-red-600"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${student.statut === "Actif" ? "bg-green-400" : "bg-red-400"}`} />
                        {student.statut}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
