"use client";

import { useState } from "react";
import Link from "next/link";

const MOCK_COURSES = [
  { id: 1, title: "JavaScript Avancé", description: "Closures, prototypes, async/await et patterns ES2024.", lessons: 12, students: 24, status: "published" },
  { id: 2, title: "Introduction à Python", description: "Les bases de Python avec des projets pratiques.", lessons: 8, students: 18, status: "published" },
  { id: 3, title: "React — Les Fondamentaux", description: "Composants, hooks, state management avec React 19.", lessons: 15, students: 30, status: "draft" },
  { id: 4, title: "SQL & Bases de données", description: "Requêtes SQL, jointures, optimisation de requêtes.", lessons: 6, students: 0, status: "archived" },
];

const STATUS_BADGE: Record<string, string> = {
  published: "bg-green-500/10 text-green-400 dark:text-green-600",
  draft: "bg-yellow-500/10 text-yellow-400 dark:text-yellow-600",
  archived: "bg-gray-500/10 text-gray-400 dark:text-gray-500",
};

const STATUS_LABEL: Record<string, string> = {
  published: "Publié",
  draft: "Brouillon",
  archived: "Archivé",
};

const TABS = [
  { label: "Tous", value: "all" },
  { label: "Publié", value: "published" },
  { label: "Brouillon", value: "draft" },
  { label: "Archivé", value: "archived" },
];

export default function CoursPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = MOCK_COURSES.filter((c) =>
    activeTab === "all" ? true : c.status === activeTab
  );

  return (
    <div className="px-6 py-8 space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white dark:text-gray-900">Mes cours</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Gérez et créez vos cours
          </p>
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
          + Nouveau cours
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-green-600 text-white"
                : "bg-white/5 dark:bg-gray-100 text-gray-400 dark:text-gray-600 hover:bg-white/10 dark:hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-center text-sm text-gray-500 py-16">Aucun cours trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((course) => (
            <div key={course.id} className="rounded-2xl border border-white/10 dark:border-gray-300 bg-[#111118] dark:bg-white shadow-md overflow-hidden">
              <div className="h-20 bg-gradient-to-br from-green-900/60 to-teal-900/60 dark:from-green-100 dark:to-teal-100" />
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-white dark:text-gray-900 text-sm leading-snug">{course.title}</h3>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium shrink-0 ${STATUS_BADGE[course.status]}`}>
                    {STATUS_LABEL[course.status]}
                  </span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                  <span>📚 {course.lessons} leçons</span>
                  <span>👥 {course.students} étudiants</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <Link
                    href={`/teacher/cours/${course.id}`}
                    className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                  >
                    Modifier
                  </Link>
                  <button className="px-3 py-2 bg-white/5 dark:bg-gray-100 hover:bg-white/10 dark:hover:bg-gray-200 rounded-lg text-gray-400 text-xs transition-colors">
                    ···
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
