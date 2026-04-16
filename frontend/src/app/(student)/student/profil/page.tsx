"use client";

import ProgressBar from "@/components/course/ProgressBar";

const ONGOING_COURSES = [
  { title: "Introduction au JavaScript", progress: 75, category: "Web Development", icon: "🌐" },
  { title: "Python pour la Data Science", progress: 40, category: "Data Science", icon: "🐍" },
  { title: "Les bases du Machine Learning", progress: 20, category: "AI & ML", icon: "🤖" },
];

const STATS = [
  { label: "Cours suivis", value: "12", icon: "📖", bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400" },
  { label: "Cours complétés", value: "8", icon: "✅", bg: "bg-green-500/10", border: "border-green-500/20", text: "text-green-400" },
  { label: "Heures d'apprentissage", value: "47h", icon: "⏱️", bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400" },
  { label: "Jours consécutifs", value: "5 🔥", icon: "📅", bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-400" },
];

export default function StudentProfilPage() {
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
          A
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white dark:text-gray-900">Alexandre Dupont</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500">alexandre.dupont@email.com</p>
          <span className="inline-block mt-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 dark:text-purple-600">
            Étudiant
          </span>
        </div>
        <button className="shrink-0 text-sm font-medium px-4 py-2 rounded-xl border border-purple-500/30 text-purple-400 dark:text-purple-600 hover:bg-purple-500/10 transition-colors">
          ✏️ Modifier
        </button>
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
        <div className="px-6 py-4 border-b border-white/5 dark:border-gray-100">
          <h2 className="text-sm font-semibold text-white dark:text-gray-900">Cours en cours</h2>
        </div>
        <div className="divide-y divide-white/5 dark:divide-gray-100">
          {ONGOING_COURSES.map((course) => (
            <div key={course.title} className="px-6 py-4 flex items-center gap-4 hover:bg-white/5 dark:hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center text-lg shrink-0">
                {course.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white dark:text-gray-900 truncate">{course.title}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{course.category}</p>
                <ProgressBar value={course.progress} color="purple" className="mt-2" />
              </div>
              <span className="text-xs font-semibold text-purple-400 dark:text-purple-600 shrink-0">
                {course.progress}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}