"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useSchoolStore } from "@/store/schoolStore";

const FILTERS = ["Tous", "A-M", "N-Z"];

type Student = {
  id: string;
  name: string;
  email: string;
};

export default function ElevesPage() {
  const activeSchool = useSchoolStore((s) => s.activeSchool);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");

  useEffect(() => {
    if (!activeSchool?.id) { setIsLoading(false); return; }
    api.get<Student[]>(`/schools/${activeSchool.id}/students`)
      .then((data) => setStudents(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [activeSchool]);

  const exportCSV = () => {
    const headers = ["Nom", "Email"];
    const rows = filtered.map((s) => [s.name, s.email]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "eleves.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      activeFilter === "Tous" ? true :
      activeFilter === "A-M" ? s.name[0]?.toUpperCase() <= "M" :
      s.name[0]?.toUpperCase() > "M";
    return matchSearch && matchFilter;
  });

  return (
    <div className="px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white dark:text-gray-900">Élèves</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          {isLoading ? "Chargement…" : `${students.length} élève${students.length > 1 ? "s" : ""} actif${students.length > 1 ? "s" : ""}`}
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
          <button
            onClick={exportCSV}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white transition-colors"
          >
            📥 Exporter CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 dark:border-gray-200">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Élève</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 dark:divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center">
                    <div className="flex justify-center"><div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-sm text-gray-500">
                    {!activeSchool
                      ? "Aucune école sélectionnée."
                      : students.length === 0
                      ? "Aucun élève actif sur les cours de l'école."
                      : "Aucun élève trouvé."}
                  </td>
                </tr>
              ) : (
                filtered.map((student) => (
                  <tr key={student.id} className="hover:bg-white/5 dark:hover:bg-gray-100 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-600/20 flex items-center justify-center text-sm font-bold text-orange-400">
                          {student.name[0]?.toUpperCase()}
                        </div>
                        <p className="font-medium text-white dark:text-gray-900">{student.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 dark:text-gray-500">{student.email}</td>
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
