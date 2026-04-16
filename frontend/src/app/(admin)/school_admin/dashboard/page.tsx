"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useSchoolStore } from "@/store/schoolStore";
import { AdminKpiCards } from "./AdminKpiCards";
import { AdminPerformancePanel } from "./AdminPerformancePanel";
import { AdminQuickLinks } from "./AdminQuickLinks";

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
    if (!token || !activeSchool?.id) { setIsLoading(false); return; }
    fetch(`${API}/analytics/schools/${activeSchool.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => { if (!r.ok) throw new Error("Impossible de charger les stats"); return r.json(); })
      .then((data: SchoolAnalytics) => setAnalytics(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [token, activeSchool]);

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

      {error && <p className="text-red-400 text-sm text-center py-8">{error}</p>}

      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && !error && (
        <>
          <AdminKpiCards analytics={analytics} isLoading={isLoading} />
          {analytics && <AdminPerformancePanel analytics={analytics} />}
          <AdminQuickLinks />
        </>
      )}
    </div>
  );
}
