"use client";

import Link from "next/link";

const STATS = [
  { label: "Classes actives", value: "4", icon: "🏫", color: "from-green-600 to-green-400" },
  { label: "Étudiants", value: "87", icon: "👥", color: "from-emerald-600 to-emerald-400" },
  { label: "Cours créés", value: "12", icon: "📖", color: "from-teal-600 to-teal-400" },
  { label: "Exercices", value: "34", icon: "💻", color: "from-cyan-600 to-cyan-400" },
];

const CLASSES = [
  { id: 1, name: "JS Avancé — Groupe A", students: 24, courses: 3, completion: 72 },
  { id: 2, name: "Python Débutant — Groupe B", students: 18, courses: 5, completion: 45 },
  { id: 3, name: "React Fondamentaux", students: 30, courses: 4, completion: 88 },
  { id: 4, name: "SQL & Bases de données", students: 15, courses: 2, completion: 30 },
];

const ACTIVITY = [
  { text: "Lucas Martin a soumis l'exercice 3 — JS Avancé", time: "il y a 5 min", icon: "💻" },
  { text: "Emma Dupont a terminé le cours React Hooks", time: "il y a 22 min", icon: "✅" },
  { text: "3 nouvelles inscriptions dans Python Débutant", time: "il y a 1h", icon: "👥" },
  { text: "Quiz Closures — 18/24 étudiants ont répondu", time: "il y a 2h", icon: "📝" },
];

export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-[#0f0f1a] dark:bg-gray-50 px-8 py-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white dark:text-gray-900">
              Bonjour, Professeur 👋
            </h1>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Voici un aperçu de vos classes et de l'activité récente.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/teacher/classes"
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              + Nouvelle classe
            </Link>
            <Link
              href="/teacher/cours"
              className="bg-white/5 dark:bg-gray-200 hover:bg-white/10 dark:hover:bg-gray-300 text-white dark:text-gray-900 text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              + Nouveau cours
            </Link>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-5 flex flex-col gap-3"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-lg`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-white dark:text-gray-900">{stat.value}</p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Classes */}
          <div className="lg:col-span-2 bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white dark:text-gray-900">Mes classes</h2>
              <Link
                href="/teacher/classes"
                className="text-green-400 hover:text-green-300 text-xs"
              >
                Voir tout →
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {CLASSES.map((cls) => (
                <Link
                  key={cls.id}
                  href={`/teacher/classes/${cls.id}`}
                  className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 dark:bg-gray-50 hover:bg-white/10 dark:hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white dark:text-gray-900">{cls.name}</p>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {cls.students} élèves · {cls.courses} cours
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-white/10 dark:bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${cls.completion}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 w-8 text-right">
                      {cls.completion}%
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Activité récente */}
          <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-semibold text-white dark:text-gray-900">Activité récente</h2>
            <div className="flex flex-col gap-4">
              {ACTIVITY.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-lg shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-xs text-gray-300 dark:text-gray-700 leading-snug">
                      {item.text}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
