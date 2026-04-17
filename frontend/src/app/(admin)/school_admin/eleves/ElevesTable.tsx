"use client";

import { Download } from "lucide-react";

type Student = {
  id: string;
  name: string;
  email: string;
};

interface Props {
  students: Student[];
  filtered: Student[];
  isLoading: boolean;
  hasActiveSchool: boolean;
  onExport: () => void;
}

export function ElevesTable({ students, filtered, isLoading, hasActiveSchool, onExport }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 dark:border-gray-300 bg-[#111118] dark:bg-white shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10 dark:border-gray-200 bg-white/5 dark:bg-gray-50 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white dark:text-gray-900">
          {filtered.length} élève{filtered.length > 1 ? "s" : ""}
        </h2>
        <button
          onClick={onExport}
          disabled={filtered.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white transition-colors"
        >
          <Download size={14} /> Exporter CSV
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
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-sm text-gray-500">
                  {!hasActiveSchool
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
  );
}
