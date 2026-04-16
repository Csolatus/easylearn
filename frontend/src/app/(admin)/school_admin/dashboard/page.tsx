"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useSchoolStore } from "@/store/schoolStore";

const API = process.env.NEXT_PUBLIC_API_URL;

type SchoolAnalytics = {
  school_id: string;
  total_courses: number;
  total_teachers: number;
  total_classrooms: number;
  avg_lesson_completion_pct: number;
  avg_quiz_score_pct: number;
};

export default function SchoolAdminDashboardPage() {
  const token = useAuthStore((s) => s.token);
  const activeSchool = useSchoolStore((s) => s.activeSchool);
  const [analytics, setAnalytics] = useState<SchoolAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !activeSchool?.id) {
      setIsLoading(false);
      return;
    }
    fetch(`${API}/analytics/schools/${activeSchool.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Impossible de charger les stats");
        return r.json();
      })
      .then((data: SchoolAnalytics) => setAnalytics(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [token, activeSchool]);

  const KPI_CARDS = [
    {
      label: "Cours disponibles",
      value: isLoading ? "…" : String(analytics?.total_courses ?? 0),
      icon: "📖",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      text: "text-purple-400",
    },
    {
      label: "Professeurs actifs",
      value: isLoading ? "…" : String(analytics?.total_teachers ?? 0),
      icon: "🧑‍🏫",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-400",
    },
    {
      label: "Classes",
      value: isLoading ? "…" : String(analytics?.total_classrooms ?? 0),
      icon: "🏫",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      text: "text-orange-400",
    },
    {
      label: "Taux de complétion",
      value: isLoading ? "…" : `${Math.round(analytics?.avg_lesson_completion_pct ?? 0)}%`,
      icon: "📊",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      text: "text-yellow-400",
    },
  ];

  return (
    <div className="px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white dark:text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Vue d&apos;ensemble de votre école
          {activeSchool && <span className="text-orange-400 ml-1">— {activeSchool.name}</span>}
        </p>
      </div>

      {!activeSchool && !isLoading && (
        <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 px-6 py-5">
          <p className="text-sm text-orange-400">Aucune école sélectionnée. Veuillez contacter un super administrateur.</p>
        </div>
      )}

      {error && (
        <div className="flex justify-center py-8">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {KPI_CARDS.map((card) => (
              <div
                key={card.label}
                className={`rounded-2xl border ${card.border} ${card.bg} px-5 py-5 flex flex-col gap-3`}
              >
                <span className="text-xl">{card.icon}</span>
                <div>
                  <p className={`text-2xl font-bold ${card.text}`}>{card.value}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{card.label}</p>
                </div>
              </div>
            ))}
          </div>

          {analytics && (
            <div className="rounded-2xl border border-white/10 dark:border-gray-300 bg-[#111118] dark:bg-white shadow-md p-6">
              <h2 className="text-sm font-semibold text-white dark:text-gray-900 mb-6">Performance globale</h2>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-40">Complétion leçons</span>
                  <div className="flex-1 h-2 bg-white/10 dark:bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.round(analytics.avg_lesson_completion_pct)}%` }} />
                  </div>
                  <span className="text-xs text-orange-400 w-10 text-right">{Math.round(analytics.avg_lesson_completion_pct)}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-40">Score quiz moyen</span>
                  <div className="flex-1 h-2 bg-white/10 dark:bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${Math.round(analytics.avg_quiz_score_pct)}%` }} />
                  </div>
                  <span className="text-xs text-yellow-400 w-10 text-right">{Math.round(analytics.avg_quiz_score_pct)}%</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/school_admin/professeurs"
              className="rounded-2xl border border-white/10 dark:border-gray-200 bg-[#111118] dark:bg-white shadow-md p-6 flex items-center gap-4 hover:ring-2 hover:ring-orange-500/50 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-600/20 flex items-center justify-center text-2xl">🧑‍🏫</div>
              <div>
                <p className="text-sm font-semibold text-white dark:text-gray-900">Gérer les professeurs</p>
                <p className="text-xs text-gray-400 mt-0.5">Inviter, suspendre, retirer</p>
              </div>
            </Link>
            <Link
              href="/school_admin/catalogue"
              className="rounded-2xl border border-white/10 dark:border-gray-200 bg-[#111118] dark:bg-white shadow-md p-6 flex items-center gap-4 hover:ring-2 hover:ring-orange-500/50 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center text-2xl">📚</div>
              <div>
                <p className="text-sm font-semibold text-white dark:text-gray-900">Catalogue de cours</p>
                <p className="text-xs text-gray-400 mt-0.5">Gérer l&apos;accès aux cours</p>
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
