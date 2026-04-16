"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

const API = process.env.NEXT_PUBLIC_API_URL;

type CourseAnalytics = {
  course_id: string;
  title: string;
  total_lessons: number;
  completed_lessons: number;
  unique_students: number;
  avg_quiz_score_pct: number;
};

type TeacherAnalytics = {
  total_courses: number;
  total_lessons: number;
  avg_lesson_completion_pct: number;
  avg_quiz_score_pct: number;
  courses: CourseAnalytics[];
};

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-5">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-white dark:text-gray-900 text-sm font-medium mt-1">{label}</p>
      <p className="text-gray-500 text-xs mt-0.5">{sub}</p>
    </div>
  );
}

export default function StatsPage() {
  const token = useAuthStore((s) => s.token);
  const [analytics, setAnalytics] = useState<TeacherAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/analytics/teachers/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        if (!r.ok) throw new Error("Impossible de charger les stats");
        return r.json();
      })
      .then((data: TeacherAnalytics) => setAnalytics(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [token]);

  const maxStudents = analytics
    ? Math.max(1, ...analytics.courses.map((c) => c.unique_students))
    : 1;

  return (
    <div className="min-h-screen bg-[#0f0f1a] dark:bg-gray-50 px-8 py-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white dark:text-gray-900">Statistiques</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Vue d&apos;ensemble de la progression de vos étudiants.
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="flex justify-center py-20">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {!isLoading && !error && analytics && (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Cours créés"
                value={String(analytics.total_courses)}
                sub="total"
                color="text-green-400"
              />
              <StatCard
                label="Leçons créées"
                value={String(analytics.total_lessons)}
                sub="total"
                color="text-emerald-400"
              />
              <StatCard
                label="Complétion moyenne"
                value={`${Math.round(analytics.avg_lesson_completion_pct)}%`}
                sub="toutes leçons"
                color="text-teal-400"
              />
              <StatCard
                label="Score quiz moyen"
                value={`${Math.round(analytics.avg_quiz_score_pct)}%`}
                sub="tous quiz"
                color="text-yellow-400"
              />
            </div>

            {/* Bar chart — étudiants par cours */}
            {analytics.courses.length > 0 && (
              <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6">
                <h2 className="font-semibold text-white dark:text-gray-900 mb-6">
                  Étudiants uniques par cours
                </h2>
                <div className="flex items-end gap-3 h-36">
                  {analytics.courses.map((c) => (
                    <div key={c.course_id} className="flex flex-col items-center gap-2 flex-1 min-w-0">
                      <span className="text-xs text-gray-400">{c.unique_students}</span>
                      <div
                        className="w-full bg-green-500 rounded-t-lg transition-all duration-300"
                        style={{ height: `${Math.max(4, (c.unique_students / maxStudents) * 100)}%` }}
                      />
                      <span className="text-xs text-gray-500 truncate w-full text-center">
                        {c.title.split(" ").slice(0, 2).join(" ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course breakdown */}
            <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-5">
              <h2 className="font-semibold text-white dark:text-gray-900">Détail par cours</h2>

              {analytics.courses.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-8">Aucun cours créé.</p>
              )}

              <div className="flex flex-col gap-3">
                {analytics.courses.map((course) => {
                  const completion = course.total_lessons > 0
                    ? Math.round((course.completed_lessons / course.total_lessons) * 100)
                    : 0;
                  return (
                    <div key={course.course_id} className="p-4 rounded-xl bg-white/5 dark:bg-gray-50 flex flex-col gap-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <p className="font-medium text-white dark:text-gray-900 text-sm">{course.title}</p>
                        <div className="flex gap-4 text-xs text-gray-400 dark:text-gray-500">
                          <span>👥 {course.unique_students} étudiant{course.unique_students > 1 ? "s" : ""}</span>
                          <span>📚 {course.total_lessons} leçon{course.total_lessons > 1 ? "s" : ""}</span>
                          <span className={`font-medium ${
                            course.avg_quiz_score_pct >= 70 ? "text-green-400" :
                            course.avg_quiz_score_pct >= 50 ? "text-yellow-400" :
                            "text-red-400"
                          }`}>
                            ⌀ quiz {Math.round(course.avg_quiz_score_pct)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-20">Complétion</span>
                        <div className="flex-1 h-1.5 bg-white/10 dark:bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${completion}%` }} />
                        </div>
                        <span className="text-xs text-gray-400 w-8 text-right">{completion}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
