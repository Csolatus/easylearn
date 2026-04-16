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

type Period = "7j" | "30j" | "3m";

const PERIOD_LABELS: Record<Period, string> = {
  "7j": "7 derniers jours",
  "30j": "30 derniers jours",
  "3m": "3 derniers mois",
};

const PERIOD_DATA: Record<Period, { label: string; submissions: number }[]> = {
  "7j": [
    { label: "Lun", submissions: 18 },
    { label: "Mar", submissions: 32 },
    { label: "Mer", submissions: 25 },
    { label: "Jeu", submissions: 41 },
    { label: "Ven", submissions: 28 },
    { label: "Sam", submissions: 8 },
    { label: "Dim", submissions: 4 },
  ],
  "30j": [
    { label: "S1", submissions: 112 },
    { label: "S2", submissions: 98 },
    { label: "S3", submissions: 143 },
    { label: "S4", submissions: 129 },
  ],
  "3m": [
    { label: "Fév", submissions: 320 },
    { label: "Mar", submissions: 410 },
    { label: "Avr", submissions: 482 },
  ],
};

const PERIOD_KPIS: Record<Period, { submissions: string; completion: string; score: string; active: string }> = {
  "7j":  { submissions: "156",  completion: "64%", score: "72/100", active: "71" },
  "30j": { submissions: "482",  completion: "64%", score: "72/100", active: "84" },
  "3m":  { submissions: "1212", completion: "61%", score: "70/100", active: "87" },
};

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
  const [period, setPeriod] = useState<Period>("7j");

  const kpis = PERIOD_KPIS[period];
  const chartData = PERIOD_DATA[period];
  const maxSubmissions = Math.max(...chartData.map((d) => d.submissions));

  return (
    <div className="min-h-screen bg-[#0f0f1a] dark:bg-gray-50 px-8 py-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white dark:text-gray-900">Statistiques</h1>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Vue d&apos;ensemble de la progression de vos étudiants.
            </p>
          </div>
          {/* Period selector */}
          <div className="flex gap-2">
            {(["7j", "30j", "3m"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  period === p
                    ? "bg-green-600 text-white"
                    : "bg-white/5 dark:bg-gray-100 text-gray-400 dark:text-gray-600 hover:bg-white/10 dark:hover:bg-gray-200"
                }`}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Soumissions totales" value={kpis.submissions} sub={PERIOD_LABELS[period]} color="text-green-400" />
          <StatCard label="Taux de complétion" value={kpis.completion} sub="moyenne globale" color="text-emerald-400" />
          <StatCard label="Score moyen" value={kpis.score} sub="tous exercices" color="text-yellow-400" />
          <StatCard label="Étudiants actifs" value={kpis.active} sub={PERIOD_LABELS[period]} color="text-teal-400" />
        </div>

        {/* Graphe soumissions */}
        <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6">
          <h2 className="font-semibold text-white dark:text-gray-900 mb-6">
            Soumissions — {PERIOD_LABELS[period]}
          </h2>
          <div className="flex items-end gap-3 h-36">
            {chartData.map((d) => (
              <div key={d.label} className="flex flex-col items-center gap-2 flex-1">
                <span className="text-xs text-gray-400">{d.submissions}</span>
                <div
                  className="w-full bg-green-500 rounded-t-lg transition-all duration-300"
                  style={{ height: `${(d.submissions / maxSubmissions) * 100}%` }}
                />
                <span className="text-xs text-gray-500">{d.label}</span>
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
