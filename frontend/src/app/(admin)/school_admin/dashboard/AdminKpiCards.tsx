"use client";

type SchoolAnalytics = {
  total_courses: number;
  total_teachers: number;
  total_classrooms: number;
  avg_lesson_completion_pct: number;
};

interface Props {
  analytics: SchoolAnalytics | null;
  isLoading: boolean;
}

const KPI_CONFIG = [
  { key: "total_courses" as const, label: "Cours disponibles", icon: "📖", bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400" },
  { key: "total_teachers" as const, label: "Professeurs actifs", icon: "🧑‍🏫", bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400" },
  { key: "total_classrooms" as const, label: "Classes", icon: "🏫", bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400" },
];

export function AdminKpiCards({ analytics, isLoading }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {KPI_CONFIG.map((card) => (
        <div key={card.label} className={`rounded-2xl border ${card.border} ${card.bg} px-5 py-5 flex flex-col gap-3`}>
          <span className="text-xl">{card.icon}</span>
          <div>
            <p className={`text-2xl font-bold ${card.text}`}>
              {isLoading ? "…" : String(analytics?.[card.key] ?? 0)}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{card.label}</p>
          </div>
        </div>
      ))}
      <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-5 py-5 flex flex-col gap-3">
        <span className="text-xl">📊</span>
        <div>
          <p className="text-2xl font-bold text-yellow-400">
            {isLoading ? "…" : `${Math.round(analytics?.avg_lesson_completion_pct ?? 0)}%`}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Taux de complétion</p>
        </div>
      </div>
    </div>
  );
}
