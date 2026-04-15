"use client";

import { useState } from "react";

const COURSES = [
  { name: "JS Avancé", enrolled: 24, completed: 17, avgScore: 78, submissions: 142 },
  { name: "Python Débutant", enrolled: 18, completed: 8, avgScore: 65, submissions: 89 },
  { name: "React Fondamentaux", enrolled: 30, completed: 26, avgScore: 84, submissions: 210 },
  { name: "SQL & BDD", enrolled: 15, completed: 4, avgScore: 55, submissions: 41 },
];

const STUDENTS = [
  { name: "Lucas Martin", class: "JS Avancé", completion: 92, submissions: 18, avgScore: 85 },
  { name: "Emma Dupont", class: "React Fondamentaux", completion: 100, submissions: 24, avgScore: 91 },
  { name: "Théo Bernard", class: "Python Débutant", completion: 40, submissions: 9, avgScore: 60 },
  { name: "Sarah Chen", class: "JS Avancé", completion: 75, submissions: 14, avgScore: 72 },
  { name: "Marc Leroy", class: "SQL & BDD", completion: 20, submissions: 5, avgScore: 48 },
];

const WEEKLY = [
  { day: "Lun", submissions: 18 },
  { day: "Mar", submissions: 32 },
  { day: "Mer", submissions: 25 },
  { day: "Jeu", submissions: 41 },
  { day: "Ven", submissions: 28 },
  { day: "Sam", submissions: 8 },
  { day: "Dim", submissions: 4 },
];

const MAX_SUBMISSIONS = Math.max(...WEEKLY.map((d) => d.submissions));

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-5">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-white dark:text-gray-900 text-sm font-medium mt-1">{label}</p>
      <p className="text-gray-500 text-xs mt-0.5">{sub}</p>
    </div>
  );
}

export default function StatsPage() {
  const [activeTab, setActiveTab] = useState<"cours" | "etudiants">("cours");

  return (
    <div className="min-h-screen bg-[#0f0f1a] dark:bg-gray-50 px-8 py-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white dark:text-gray-900">Statistiques</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Vue d'ensemble de la progression de vos étudiants.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Soumissions totales" value="482" sub="toutes classes" color="text-green-400" />
          <StatCard label="Taux de complétion" value="64%" sub="moyenne globale" color="text-emerald-400" />
          <StatCard label="Score moyen" value="72/100" sub="tous exercices" color="text-yellow-400" />
          <StatCard label="Étudiants actifs" value="71" sub="cette semaine" color="text-teal-400" />
        </div>

        {/* Graphe soumissions hebdo */}
        <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6">
          <h2 className="font-semibold text-white dark:text-gray-900 mb-6">
            Soumissions cette semaine
          </h2>
          <div className="flex items-end gap-3 h-36">
            {WEEKLY.map((d) => (
              <div key={d.day} className="flex flex-col items-center gap-2 flex-1">
                <span className="text-xs text-gray-400">{d.submissions}</span>
                <div
                  className="w-full bg-green-500 rounded-t-lg transition-all"
                  style={{ height: `${(d.submissions / MAX_SUBMISSIONS) * 100}%` }}
                />
                <span className="text-xs text-gray-500">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs cours / étudiants */}
        <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-5">
          <div className="flex gap-2">
            {(["cours", "etudiants"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-green-600 text-white"
                    : "text-gray-400 hover:text-white bg-white/5 dark:bg-gray-100 dark:text-gray-600 dark:hover:text-gray-900"
                }`}
              >
                {tab === "cours" ? "Par cours" : "Par étudiant"}
              </button>
            ))}
          </div>

          {activeTab === "cours" && (
            <div className="flex flex-col gap-3">
              {COURSES.map((course) => (
                <div
                  key={course.name}
                  className="p-4 rounded-xl bg-white/5 dark:bg-gray-50 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="font-medium text-white dark:text-gray-900 text-sm">
                      {course.name}
                    </p>
                    <div className="flex gap-4 text-xs text-gray-400 dark:text-gray-500">
                      <span>👥 {course.enrolled} inscrits</span>
                      <span>✅ {course.completed} terminés</span>
                      <span>💻 {course.submissions} soumissions</span>
                      <span className="text-green-400 font-medium">⌀ {course.avgScore}/100</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-16">Complétion</span>
                    <div className="flex-1 h-1.5 bg-white/10 dark:bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{
                          width: `${Math.round((course.completed / course.enrolled) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-8 text-right">
                      {Math.round((course.completed / course.enrolled) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "etudiants" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 dark:text-gray-500 text-xs border-b border-white/5 dark:border-gray-200">
                    <th className="text-left pb-3 font-medium">Étudiant</th>
                    <th className="text-left pb-3 font-medium">Classe</th>
                    <th className="text-left pb-3 font-medium">Complétion</th>
                    <th className="text-left pb-3 font-medium">Soumissions</th>
                    <th className="text-left pb-3 font-medium">Score moyen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 dark:divide-gray-100">
                  {STUDENTS.map((student) => (
                    <tr key={student.name} className="text-xs">
                      <td className="py-3 text-white dark:text-gray-900 font-medium">
                        {student.name}
                      </td>
                      <td className="py-3 text-gray-400 dark:text-gray-500">{student.class}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-white/10 dark:bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${student.completion}%` }}
                            />
                          </div>
                          <span className="text-gray-400">{student.completion}%</span>
                        </div>
                      </td>
                      <td className="py-3 text-gray-400 dark:text-gray-500">
                        {student.submissions}
                      </td>
                      <td
                        className={`py-3 font-semibold ${
                          student.avgScore >= 80
                            ? "text-green-400"
                            : student.avgScore >= 60
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {student.avgScore}/100
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
