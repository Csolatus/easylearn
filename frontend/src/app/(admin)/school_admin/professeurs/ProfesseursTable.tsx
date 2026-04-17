"use client";

import { Download } from "lucide-react";

type TeacherStatus = "active" | "invited" | "suspended";

type Teacher = {
  id: string;
  name: string;
  email: string;
  classes: number;
  status: TeacherStatus;
};

const STATUS_LABELS: Record<TeacherStatus, string> = {
  active: "Actif",
  invited: "Invité",
  suspended: "Suspendu",
};

const STATUS_COLORS: Record<TeacherStatus, string> = {
  active: "bg-green-500/10 text-green-400 dark:text-green-600",
  invited: "bg-yellow-500/10 text-yellow-400 dark:text-yellow-600",
  suspended: "bg-red-500/10 text-red-400 dark:text-red-600",
};

const STATUS_DOT: Record<TeacherStatus, string> = {
  active: "bg-green-400",
  invited: "bg-yellow-400",
  suspended: "bg-red-400",
};

interface Props {
  filtered: Teacher[];
  isLoading: boolean;
  actionLoading: string | null;
  onSuspend: (teacher: Teacher) => void;
  onRemove: (teacher: Teacher) => void;
  onExport: () => void;
}

export function ProfesseursTable({ filtered, isLoading, actionLoading, onSuspend, onRemove, onExport }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 dark:border-gray-300 bg-surface shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-white/5 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">
          {filtered.length} professeur{filtered.length > 1 ? "s" : ""}
        </h2>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white transition-colors"
        >
          <Download size={14} /> Exporter CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Professeur</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Classes</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 dark:divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center">
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                  Aucun professeur trouvé.
                </td>
              </tr>
            ) : (
              filtered.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-white/5 dark:hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-600/20 flex items-center justify-center text-sm font-bold text-orange-400">
                        {teacher.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{teacher.name}</p>
                        <p className="text-xs text-muted">{teacher.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300 dark:text-gray-700 font-medium">{teacher.classes}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[teacher.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[teacher.status]}`} />
                      {STATUS_LABELS[teacher.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {teacher.status === "active" && (
                        <button
                          onClick={() => onSuspend(teacher)}
                          disabled={actionLoading === teacher.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Suspendre
                        </button>
                      )}
                      <button
                        onClick={() => onRemove(teacher)}
                        disabled={actionLoading === teacher.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Retirer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
