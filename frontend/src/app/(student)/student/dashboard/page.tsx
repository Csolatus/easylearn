"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

const API = process.env.NEXT_PUBLIC_API_URL;

type Course = { id: string; title: string };
type CourseProgress = {
  course_id: string;
  total_lessons: number;
  completed_lessons: number;
  percentage: number;
};

type EnrolledCourse = Course & CourseProgress;

const ACTIVITY = [
  { text: "Leçon complétée", time: "Récemment", icon: "✅" },
  { text: "Quiz soumis", time: "Récemment", icon: "📝" },
  { text: "Exercice pratique soumis", time: "Récemment", icon: "💻" },
];

export default function StudentDashboard() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const [enrolled, setEnrolled] = useState<EnrolledCourse[]>([]);
  const [allCount, setAllCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const headers: HeadersInit = { Authorization: `Bearer ${token}` };

    fetch(`${API}/courses`, { headers })
      .then((r) => r.json())
      .then(async (courses: Course[]) => {
        setAllCount(courses.length);
        const progressResults = await Promise.all(
          courses.map((c) =>
            fetch(`${API}/courses/${c.id}/progress/me`, { headers })
              .then((r) => (r.ok ? r.json() : null))
              .catch(() => null)
          )
        );
        const active: EnrolledCourse[] = [];
        courses.forEach((c, i) => {
          const p: CourseProgress | null = progressResults[i];
          if (p && p.completed_lessons > 0) {
            active.push({ ...c, ...p });
          }
        });
        setEnrolled(active);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [token]);

  const totalCompleted = enrolled.reduce((sum, c) => sum + c.completed_lessons, 0);
  const inProgress = enrolled.filter((c) => c.percentage < 100).length;
  const finished = enrolled.filter((c) => c.percentage === 100).length;

  const STATS = [
    { label: "Cours en cours", value: isLoading ? "…" : String(inProgress), color: "text-purple-400" },
    { label: "Leçons complétées", value: isLoading ? "…" : String(totalCompleted), color: "text-emerald-400" },
    { label: "Cours terminés", value: isLoading ? "…" : String(finished), color: "text-yellow-400" },
    { label: "Cours disponibles", value: isLoading ? "…" : String(allCount), color: "text-pink-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f1a] dark:bg-gray-50 px-8 py-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white dark:text-gray-900">
            Bonjour{user?.email ? `, ${user.email.split("@")[0]}` : ""} 👋
          </h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Continuez là où vous en étiez.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-5">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-white dark:text-gray-900 text-sm font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My courses */}
          <div className="lg:col-span-2 bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white dark:text-gray-900">Mes cours</h2>
              <Link href="/student/catalogue" className="text-purple-400 hover:text-purple-300 text-xs">
                Explorer →
              </Link>
            </div>

            {isLoading && (
              <div className="flex justify-center py-6">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!isLoading && enrolled.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-6">
                <p className="text-gray-500 text-sm">Vous n&apos;avez pas encore commencé de cours.</p>
                <Link
                  href="/student/catalogue"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors"
                >
                  Découvrir les cours →
                </Link>
              </div>
            )}

            {!isLoading && enrolled.map((course) => (
              <Link
                key={course.id}
                href={`/student/cours/${course.id}`}
                className="flex flex-col gap-3 p-4 rounded-xl bg-white/5 dark:bg-gray-50 hover:bg-white/10 dark:hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white dark:text-gray-900">{course.title}</p>
                  {course.percentage === 100 ? (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Terminé</span>
                  ) : (
                    <span className="text-xs text-gray-400">{Math.round(course.percentage)}%</span>
                  )}
                </div>
                <div className="h-1.5 bg-white/10 dark:bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${course.percentage === 100 ? "bg-green-500" : "bg-purple-500"}`}
                    style={{ width: `${course.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400">
                  {course.completed_lessons}/{course.total_lessons} leçons complétées
                </p>
              </Link>
            ))}
          </div>

          {/* Activity */}
          <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-semibold text-white dark:text-gray-900">Activité récente</h2>
            {ACTIVITY.map((item, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-lg shrink-0">{item.icon}</span>
                <div>
                  <p className="text-xs text-gray-300 dark:text-gray-700 leading-snug">{item.text}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
