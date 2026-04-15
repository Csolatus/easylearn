"use client";

import { useState } from "react";
import Link from "next/link";

const COURSES = [
  { id: 1, title: "JavaScript Avancé", description: "Closures, prototypes, async/await et patterns ES2024.", lessons: 12, students: 24, status: "published" },
  { id: 2, title: "Introduction à Python", description: "Les bases de Python avec des projets pratiques.", lessons: 8, students: 18, status: "published" },
  { id: 3, title: "React — Les Fondamentaux", description: "Composants, hooks, state management avec React 19.", lessons: 15, students: 30, status: "draft" },
  { id: 4, title: "SQL & Bases de données", description: "Requêtes SQL, jointures, optimisation de requêtes.", lessons: 6, students: 15, status: "published" },
];

const STATUS_STYLES: Record<string, string> = {
  published: "bg-green-500/20 text-green-400",
  draft: "bg-yellow-500/20 text-yellow-400",
};

export default function CoursPage() {
  const [search, setSearch] = useState("");

  const filtered = COURSES.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f0f1a] dark:bg-gray-50 px-8 py-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white dark:text-gray-900">Mes cours</h1>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              {COURSES.length} cours créés · {COURSES.reduce((a, c) => a + c.lessons, 0)} leçons au total
            </p>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
            + Nouveau cours
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-sm">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Rechercher un cours..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a2e] dark:bg-white dark:text-gray-900 dark:shadow-sm text-white placeholder-gray-500 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Courses grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-16 col-span-2">Aucun cours trouvé.</p>
          )}
          {filtered.map((course) => (
            <div key={course.id} className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl overflow-hidden">
              <div className="h-24 bg-gradient-to-br from-green-900 to-teal-900 dark:from-green-200 dark:to-teal-200" />
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-white dark:text-gray-900 text-sm leading-snug">{course.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${STATUS_STYLES[course.status]}`}>
                    {course.status === "published" ? "Publié" : "Brouillon"}
                  </span>
                </div>
                <p className="text-gray-400 dark:text-gray-500 text-xs line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                  <span>📚 {course.lessons} leçons</span>
                  <span>👥 {course.students} étudiants</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <Link
                    href={`/teacher/cours/${course.id}/edit`}
                    className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                  >
                    Modifier
                  </Link>
                  <button className="px-3 py-2 bg-white/5 dark:bg-gray-100 hover:bg-white/10 rounded-lg text-gray-400 text-xs transition-colors">
                    ···
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
