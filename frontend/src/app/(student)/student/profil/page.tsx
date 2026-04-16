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

export default function StudentProfilPage() {
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

  const inProgress = enrolled.filter((c) => c.percentage < 100).length;
  const finished = enrolled.filter((c) => c.percentage === 100).length;
  const totalCompleted = enrolled.reduce((sum, c) => sum + c.completed_lessons, 0);

  const displayName = user?.email ? user.email.split("@")[0] : "Étudiant";
  const initial = displayName[0]?.toUpperCase() ?? "E";

  const STATS = [
    { label: "Cours suivis", value: isLoading ? "…" : String(enrolled.length), icon: "📖", bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400" },
    { label: "Cours complétés", value: isLoading ? "…" : String(finished), icon: "✅", bg: "bg-green-500/10", border: "border-green-500/20", text: "text-green-400" },
    { label: "Leçons complétées", value: isLoading ? "…" : String(totalCompleted), icon: "📝", bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400" },
    { label: "Cours disponibles", value: isLoading ? "…" : String(allCount), icon: "🌐", bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-400" },
  ];

  return (
    <div className="px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white dark:text-gray-900">Mon Profil</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Gérez vos informations personnelles
        </p>
      </div>

      <div className="rounded-2xl border border-white/5 dark:border-gray-200 bg-[#111118] dark:bg-white px-6 py-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-2xl font-bold text-white shrink-0">
          {initial}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white dark:text-gray-900">{displayName}</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500">{user?.email ?? ""}</p>
          <span className="inline-block mt-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 dark:text-purple-600">
            Étudiant
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl border ${stat.border} ${stat.bg} px-5 py-5 flex flex-col gap-2`}
          >
            <span className="text-xl">{stat.icon}</span>
            <p className={`text-2xl font-bold ${stat.text}`}>{stat.value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/5 dark:border-gray-200 bg-[#111118] dark:bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 dark:border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white dark:text-gray-900">Cours en cours</h2>
          <Link href="/student/catalogue" className="text-xs text-purple-400 hover:text-purple-300">Explorer →</Link>
        </div>

        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && inProgress === 0 && (
          <div className="flex flex-col items-center gap-3 py-8">
            <p className="text-sm text-gray-500">Aucun cours en cours.</p>
            <Link href="/student/catalogue" className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors">
              Découvrir les cours →
            </Link>
          </div>
        )}

        <div className="divide-y divide-white/5 dark:divide-gray-100">
          {!isLoading && enrolled
            .filter((c) => c.percentage < 100)
            .map((course) => (
              <Link
                key={course.id}
                href={`/student/cours/${course.id}`}
                className="px-6 py-4 flex items-center gap-4 hover:bg-white/5 dark:hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center text-lg shrink-0">
                  📖
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white dark:text-gray-900 truncate">{course.title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {course.completed_lessons}/{course.total_lessons} leçons
                  </p>
                  <div className="mt-2 h-1.5 w-full bg-white/10 dark:bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${course.percentage}%` }} />
                  </div>
                </div>
                <span className="text-xs font-semibold text-purple-400 dark:text-purple-600 shrink-0">
                  {Math.round(course.percentage)}%
                </span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
