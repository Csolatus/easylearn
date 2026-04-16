"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import Spinner from "@/components/ui/Spinner";
import StatsKpiCards from "./StatsKpiCards";
import StudentsBarChart from "./StudentsBarChart";
import CourseBreakdownList from "./CourseBreakdownList";

const API = process.env.NEXT_PUBLIC_API_URL;

type CourseAnalytics = { course_id: string; title: string; total_lessons: number; completed_lessons: number; unique_students: number; avg_quiz_score_pct: number };
type TeacherAnalytics = { total_courses: number; total_lessons: number; avg_lesson_completion_pct: number; avg_quiz_score_pct: number; courses: CourseAnalytics[] };

export default function StatsPage() {
  const token = useAuthStore((s) => s.token);
  const [analytics, setAnalytics] = useState<TeacherAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/analytics/teachers/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => { if (!r.ok) throw new Error("Impossible de charger les stats"); return r.json(); })
      .then((data: TeacherAnalytics) => setAnalytics(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [token]);

  const kpiCards = analytics ? [
    { label: "Cours créés", value: String(analytics.total_courses), sub: "total", color: "text-green-400" },
    { label: "Leçons créées", value: String(analytics.total_lessons), sub: "total", color: "text-emerald-400" },
    { label: "Complétion moyenne", value: `${Math.round(analytics.avg_lesson_completion_pct)}%`, sub: "toutes leçons", color: "text-teal-400" },
    { label: "Score quiz moyen", value: `${Math.round(analytics.avg_quiz_score_pct)}%`, sub: "tous quiz", color: "text-yellow-400" },
  ] : [];

  return (
    <div className="min-h-screen bg-[#0f0f1a] dark:bg-gray-50 px-8 py-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold text-white dark:text-gray-900">Statistiques</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Vue d&apos;ensemble de la progression de vos étudiants.</p>
        </div>
        {isLoading && <div className="flex justify-center py-20"><Spinner color="border-green-500" /></div>}
        {error && <div className="flex justify-center py-20"><p className="text-red-400 text-sm">{error}</p></div>}
        {!isLoading && !error && analytics && (
          <>
            <StatsKpiCards cards={kpiCards} />
            {analytics.courses.length > 0 && <StudentsBarChart courses={analytics.courses} />}
            <CourseBreakdownList courses={analytics.courses} />
          </>
        )}
      </div>
    </div>
  );
}
