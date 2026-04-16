"use client";

import Link from "next/link";
import ProgressBar from "@/components/course/ProgressBar";

const MY_COURSES = [
  { id: 1, title: "Advanced Modern JavaScript", instructor: "Marc Dupont", progress: 68, lessons: 42, nextLesson: "Async Generators" },
  { id: 2, title: "Neural Networks from Ground Zero", instructor: "Sarah Connor", progress: 30, lessons: 38, nextLesson: "Backpropagation" },
  { id: 3, title: "Introduction to Python", instructor: "Alice Martin", progress: 100, lessons: 30, nextLesson: null },
];

const ACTIVITY = [
  { text: "Leçon 'Closures & Scopes' complétée", time: "il y a 1h", icon: "✅" },
  { text: "Quiz JavaScript — Score : 85/100", time: "il y a 3h", icon: "📝" },
  { text: "Exercice pratique soumis — Neural Networks", time: "hier", icon: "💻" },
  { text: "Nouveau cours disponible : Kubernetes", time: "il y a 2 jours", icon: "🎉" },
];

const STATS = [
  { label: "Cours en cours", value: "2", color: "text-purple-400" },
  { label: "Leçons complétées", value: "47", color: "text-emerald-400" },
  { label: "Score moyen", value: "82%", color: "text-yellow-400" },
  { label: "Jours consécutifs", value: "5", color: "text-pink-400" },
];

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-[#0f0f1a] dark:bg-gray-50 px-8 py-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white dark:text-gray-900">Bonjour, Étudiant 👋</h1>
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
            {MY_COURSES.map((course) => (
              <Link
                key={course.id}
                href={`/student/cours/${course.id}`}
                className="flex flex-col gap-3 p-4 rounded-xl bg-white/5 dark:bg-gray-50 hover:bg-white/10 dark:hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white dark:text-gray-900">{course.title}</p>
                  {course.progress === 100 ? (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Terminé</span>
                  ) : (
                    <span className="text-xs text-gray-400">{course.progress}%</span>
                  )}
                </div>
                <ProgressBar
                  value={course.progress}
                  color={course.progress === 100 ? "green" : "purple"}
                  className="flex-1"
                />
                {course.nextLesson && (
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Prochaine leçon : <span className="text-purple-400">{course.nextLesson}</span>
                  </p>
                )}
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
