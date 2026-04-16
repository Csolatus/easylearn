"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

type Classroom = {
  id: string;
  name: string;
  is_archived: boolean;
  invite_code: string;
};

export default function TeacherDashboard() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const [analytics, setAnalytics] = useState<TeacherAnalytics | null>(null);
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const headers: HeadersInit = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API}/analytics/teachers/me`, { headers }).then((r) => r.ok ? r.json() : null),
      fetch(`${API}/classrooms`, { headers }).then((r) => r.ok ? r.json() : []),
    ])
      .then(([analyticsData, classroomsData]) => {
        setAnalytics(analyticsData);
        setClasses(classroomsData ?? []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [token]);

  const activeClasses = classes.filter((c) => !c.is_archived);

  const STATS = [
    { label: "Classes actives", value: isLoading ? "…" : String(activeClasses.length), icon: "🏫", color: "from-green-600 to-green-400" },
    { label: "Cours créés", value: isLoading ? "…" : String(analytics?.total_courses ?? 0), icon: "📖", color: "from-teal-600 to-teal-400" },
    { label: "Leçons créées", value: isLoading ? "…" : String(analytics?.total_lessons ?? 0), icon: "📝", color: "from-emerald-600 to-emerald-400" },
    { label: "Score quiz moyen", value: isLoading ? "…" : `${Math.round(analytics?.avg_quiz_score_pct ?? 0)}%`, icon: "🎯", color: "from-cyan-600 to-cyan-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f1a] dark:bg-gray-50 px-8 py-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white dark:text-gray-900">
            Bonjour{user?.email ? `, ${user.email.split("@")[0]}` : ""} 👋
          </h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Vue d&apos;ensemble de vos cours et classes.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className={`rounded-2xl p-5 bg-gradient-to-br ${s.color} text-white`}>
              <p className="text-3xl mb-1">{s.icon}</p>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm font-medium opacity-90 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cours récents */}
          <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white dark:text-gray-900">Mes cours</h2>
              <Link href="/teacher/cours" className="text-green-400 hover:text-green-300 text-xs">Voir tout →</Link>
            </div>

            {isLoading && <div className="flex justify-center py-6"><div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>}

            {!isLoading && (!analytics || analytics.courses.length === 0) && (
              <div className="flex flex-col items-center gap-3 py-6">
                <p className="text-gray-500 text-sm">Aucun cours créé.</p>
                <Link href="/teacher/cours" className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors">
                  Créer un cours →
                </Link>
              </div>
            )}

            {!isLoading && analytics?.courses.map((course) => {
              const pct = course.total_lessons > 0
                ? Math.round((course.completed_lessons / course.total_lessons) * 100)
                : 0;
              return (
                <Link key={course.course_id} href={`/teacher/cours/${course.course_id}`}
                  className="flex flex-col gap-2 p-3 rounded-xl bg-white/5 dark:bg-gray-50 hover:bg-white/10 dark:hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white dark:text-gray-900">{course.title}</p>
                    <span className="text-xs text-gray-400">👥 {course.unique_students}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 dark:bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{course.completed_lessons}/{course.total_lessons} leçons complétées</span>
                    <span className="text-green-400">⌀ quiz {Math.round(course.avg_quiz_score_pct)}%</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Classes */}
          <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white dark:text-gray-900">Mes classes</h2>
              <Link href="/teacher/classes" className="text-green-400 hover:text-green-300 text-xs">Gérer →</Link>
            </div>

            {isLoading && <div className="flex justify-center py-6"><div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>}

            {!isLoading && activeClasses.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-6">
                <p className="text-gray-500 text-sm">Aucune classe active.</p>
                <Link href="/teacher/classes" className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors">
                  Créer une classe →
                </Link>
              </div>
            )}

            {!isLoading && activeClasses.map((cls) => (
              <Link key={cls.id} href={`/teacher/classes/${cls.id}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 dark:bg-gray-50 hover:bg-white/10 dark:hover:bg-gray-100 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-green-600/20 flex items-center justify-center shrink-0">🏫</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white dark:text-gray-900 truncate">{cls.name}</p>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">{cls.invite_code}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">Active</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Completion overview */}
        {!isLoading && analytics && analytics.courses.length > 0 && (
          <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6">
            <h2 className="font-semibold text-white dark:text-gray-900 mb-6">Complétion par cours</h2>
            <div className="flex items-end gap-3 h-32">
              {analytics.courses.map((course) => {
                const pct = course.total_lessons > 0
                  ? Math.round((course.completed_lessons / course.total_lessons) * 100)
                  : 0;
                return (
                  <div key={course.course_id} className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                    <span className="text-xs text-gray-400">{pct}%</span>
                    <div className="w-full bg-white/10 dark:bg-gray-200 rounded-t-lg overflow-hidden" style={{ height: "80px" }}>
                      <div className="w-full bg-green-500 rounded-t-lg transition-all duration-500" style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 truncate w-full text-center">{course.title.split(" ").slice(0, 2).join(" ")}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
