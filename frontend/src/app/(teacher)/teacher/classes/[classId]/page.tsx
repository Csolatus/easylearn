"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProgressBar from "@/components/course/ProgressBar";

type Tab = "etudiants" | "cours" | "stats";

const CLASS_DATA: Record<string, {
  name: string; students: number; courses: number; completion: number;
  studentList: { name: string; completion: number; avgScore: number; submissions: number }[];
  courseList: { title: string; lessons: number; completion: number }[];
}> = {
  "1": {
    name: "JS Avancé — Groupe A", students: 24, courses: 3, completion: 72,
    studentList: [
      { name: "Lucas Martin", completion: 92, avgScore: 85, submissions: 18 },
      { name: "Sarah Chen", completion: 75, avgScore: 72, submissions: 14 },
      { name: "Maxime Petit", completion: 60, avgScore: 65, submissions: 11 },
      { name: "Camille Roux", completion: 40, avgScore: 55, submissions: 7 },
    ],
    courseList: [
      { title: "JavaScript Avancé", lessons: 12, completion: 80 },
      { title: "Design Patterns JS", lessons: 8, completion: 65 },
      { title: "Testing avec Jest", lessons: 6, completion: 50 },
    ],
  },
  "2": {
    name: "Python Débutant — Groupe B", students: 18, courses: 5, completion: 45,
    studentList: [
      { name: "Théo Bernard", completion: 40, avgScore: 60, submissions: 9 },
      { name: "Lucie Fontaine", completion: 55, avgScore: 68, submissions: 12 },
    ],
    courseList: [
      { title: "Introduction à Python", lessons: 8, completion: 45 },
    ],
  },
};

const FALLBACK = { name: "Classe inconnue", students: 0, courses: 0, completion: 0, studentList: [], courseList: [] };

export default function ClassDetailPage() {
  const { classId } = useParams<{ classId: string }>();
  const data = CLASS_DATA[classId] ?? FALLBACK;
  const [activeTab, setActiveTab] = useState<Tab>("etudiants");

  const avgScore = data.studentList.length
    ? Math.round(data.studentList.reduce((a, s) => a + s.avgScore, 0) / data.studentList.length)
    : 0;
  const totalSubmissions = data.studentList.reduce((a, s) => a + s.submissions, 0);
  const struggling = data.studentList.filter((s) => s.completion < 50 || s.avgScore < 60);
  const active = data.studentList.filter((s) => s.completion >= 50 && s.avgScore >= 60);
  const maxCourseCompletion = Math.max(...data.courseList.map((c) => c.completion), 1);

  const TABS: { key: Tab; label: string }[] = [
    { key: "etudiants", label: "Étudiants" },
    { key: "cours", label: "Cours assignés" },
    { key: "stats", label: "Stats" },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f1a] dark:bg-gray-50 px-8 py-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div>
          <Link href="/teacher/classes" className="text-gray-400 hover:text-white dark:hover:text-gray-900 text-xs transition-colors mb-3 inline-block">
            ← Retour aux classes
          </Link>
          <h1 className="text-3xl font-bold text-white dark:text-gray-900">{data.name}</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            {data.students} étudiants · {data.courses} cours · {data.completion}% de complétion globale
          </p>
        </div>

        {/* Progression bar */}
        <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-5 flex items-center gap-4">
          <span className="text-gray-400 text-sm w-28">Complétion globale</span>
          <ProgressBar value={data.completion} color="green" size="lg" className="flex-1" />
          <span className="text-green-400 font-bold text-sm w-10 text-right">{data.completion}%</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-green-600 text-white"
                  : "bg-white/5 dark:bg-gray-100 text-gray-400 dark:text-gray-600 hover:bg-white/10 dark:hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab — Étudiants */}
        {activeTab === "etudiants" && (
          <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-semibold text-white dark:text-gray-900">Étudiants</h2>
            {data.studentList.length === 0 && <p className="text-gray-500 text-sm">Aucun étudiant.</p>}
            <div className="flex flex-col gap-3">
              {data.studentList.map((student) => (
                <div key={student.name} className="p-3 rounded-xl bg-white/5 dark:bg-gray-50 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-xs text-white font-bold">
                        {student.name[0]}
                      </div>
                      <span className="text-sm font-medium text-white dark:text-gray-900">{student.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">{student.submissions} soumissions</span>
                      <span className={`text-xs font-semibold ${student.avgScore >= 80 ? "text-green-400" : student.avgScore >= 60 ? "text-yellow-400" : "text-red-400"}`}>
                        {student.avgScore}/100
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ProgressBar value={student.completion} color="green" size="sm" className="flex-1" />
                    <span className="text-xs text-gray-400 w-8 text-right">{student.completion}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab — Cours */}
        {activeTab === "cours" && (
          <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-semibold text-white dark:text-gray-900">Cours assignés</h2>
            {data.courseList.length === 0 && <p className="text-gray-500 text-sm">Aucun cours assigné.</p>}
            {data.courseList.map((course) => (
              <div key={course.title} className="p-3 rounded-xl bg-white/5 dark:bg-gray-50 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white dark:text-gray-900">{course.title}</span>
                  <span className="text-xs text-gray-400">📚 {course.lessons} leçons</span>
                </div>
                <div className="flex items-center gap-2">
                  <ProgressBar value={course.completion} color="green" size="sm" className="flex-1" />
                  <span className="text-xs text-gray-400 w-8 text-right">{course.completion}%</span>
                </div>
              </div>
            ))}
            <button className="mt-2 w-full border border-dashed border-white/10 dark:border-gray-300 text-gray-400 hover:text-white dark:hover:text-gray-900 hover:border-green-500 text-sm py-2.5 rounded-xl transition-colors">
              + Assigner un cours
            </button>
          </div>
        )}

        {/* Tab — Stats */}
        {activeTab === "stats" && (
          <div className="flex flex-col gap-6">

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-5">
                <p className="text-2xl font-bold text-green-400">{data.completion}%</p>
                <p className="text-white dark:text-gray-900 text-sm font-medium mt-1">Complétion</p>
                <p className="text-gray-500 text-xs mt-0.5">moyenne globale</p>
              </div>
              <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-5">
                <p className="text-2xl font-bold text-yellow-400">{avgScore}/100</p>
                <p className="text-white dark:text-gray-900 text-sm font-medium mt-1">Score moyen</p>
                <p className="text-gray-500 text-xs mt-0.5">tous exercices</p>
              </div>
              <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-5">
                <p className="text-2xl font-bold text-teal-400">{totalSubmissions}</p>
                <p className="text-white dark:text-gray-900 text-sm font-medium mt-1">Soumissions</p>
                <p className="text-gray-500 text-xs mt-0.5">total de la classe</p>
              </div>
              <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-5">
                <p className="text-2xl font-bold text-red-400">{struggling.length}</p>
                <p className="text-white dark:text-gray-900 text-sm font-medium mt-1">En difficulté</p>
                <p className="text-gray-500 text-xs mt-0.5">complétion &lt;50% ou score &lt;60</p>
              </div>
            </div>

            {/* Bar chart complétion par cours */}
            {data.courseList.length > 0 && (
              <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6">
                <h2 className="font-semibold text-white dark:text-gray-900 mb-6">Complétion par cours</h2>
                <div className="flex items-end gap-4 h-32">
                  {data.courseList.map((course) => (
                    <div key={course.title} className="flex flex-col items-center gap-2 flex-1">
                      <span className="text-xs text-gray-400">{course.completion}%</span>
                      <div
                        className="w-full bg-green-500 rounded-t-lg transition-all duration-300"
                        style={{ height: `${(course.completion / maxCourseCompletion) * 100}%` }}
                      />
                      <span className="text-xs text-gray-500 text-center leading-tight">{course.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actifs vs En difficulté */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-3">
                <h2 className="font-semibold text-white dark:text-gray-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                  Actifs ({active.length})
                </h2>
                {active.length === 0 && <p className="text-gray-500 text-sm">Aucun.</p>}
                {active.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-600/30 flex items-center justify-center text-xs text-green-400 font-bold">
                        {s.name[0]}
                      </div>
                      <span className="text-white dark:text-gray-900">{s.name}</span>
                    </div>
                    <span className="text-green-400 font-semibold text-xs">{s.completion}%</span>
                  </div>
                ))}
              </div>

              <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-3">
                <h2 className="font-semibold text-white dark:text-gray-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                  En difficulté ({struggling.length})
                </h2>
                {struggling.length === 0 && <p className="text-gray-500 text-sm">Aucun étudiant en difficulté.</p>}
                {struggling.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-600/30 flex items-center justify-center text-xs text-red-400 font-bold">
                        {s.name[0]}
                      </div>
                      <span className="text-white dark:text-gray-900">{s.name}</span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="text-gray-400">{s.completion}%</span>
                      <span className="text-red-400 font-semibold">{s.avgScore}/100</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
