"use client";

import { useState } from "react";

const SCHOOLS = [
  { id: 1, name: "EFREI Paris", teachers: 18, students: 420, courses: 64, plan: "Enterprise", active: true },
  { id: 2, name: "ISEP", teachers: 12, students: 310, courses: 41, plan: "Pro", active: true },
  { id: 3, name: "Epitech Lyon", teachers: 9, students: 180, courses: 28, plan: "Pro", active: true },
  { id: 4, name: "IUT Paris Rives de Seine", teachers: 7, students: 95, courses: 12, plan: "Starter", active: false },
  { id: 5, name: "Polytech Nantes", teachers: 5, students: 60, courses: 8, plan: "Starter", active: true },
];

const PLAN_STYLES: Record<string, string> = {
  Enterprise: "bg-red-500/20 text-red-400",
  Pro: "bg-orange-500/20 text-orange-400",
  Starter: "bg-gray-500/20 text-gray-400",
};

export default function EcolesPage() {
  const [search, setSearch] = useState("");

  const filtered = SCHOOLS.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f0f1a] dark:bg-gray-50 px-8 py-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white dark:text-gray-900">Écoles</h1>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">{SCHOOLS.length} établissements enregistrés</p>
          </div>
          <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
            + Ajouter une école
          </button>
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

        <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 dark:text-gray-500 text-xs border-b border-white/5 dark:border-gray-200">
                  <th className="text-left pb-3 font-medium">École</th>
                  <th className="text-left pb-3 font-medium">Profs</th>
                  <th className="text-left pb-3 font-medium">Étudiants</th>
                  <th className="text-left pb-3 font-medium">Cours</th>
                  <th className="text-left pb-3 font-medium">Plan</th>
                  <th className="text-left pb-3 font-medium">Statut</th>
                  <th className="pb-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 dark:divide-gray-100">
                {filtered.map((school) => (
                  <tr key={school.id} className="text-xs group">
                    <td className="py-3 text-white dark:text-gray-900 font-medium">{school.name}</td>
                    <td className="py-3 text-gray-400 dark:text-gray-500">{school.teachers}</td>
                    <td className="py-3 text-gray-400 dark:text-gray-500">{school.students}</td>
                    <td className="py-3 text-gray-400 dark:text-gray-500">{school.courses}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full font-medium ${PLAN_STYLES[school.plan]}`}>{school.plan}</span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full font-medium ${school.active ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                        {school.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white dark:hover:text-gray-900 text-xs transition-all px-2 py-1 rounded-lg hover:bg-white/10 dark:hover:bg-gray-100">
                        Gérer →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
