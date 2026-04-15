"use client";

import { useState } from "react";
import Link from "next/link";

const CLASSES = [
  { id: 1, name: "JS Avancé — Groupe A", students: 24, courses: 3, completion: 72, active: true },
  { id: 2, name: "Python Débutant — Groupe B", students: 18, courses: 5, completion: 45, active: true },
  { id: 3, name: "React Fondamentaux", students: 30, courses: 4, completion: 88, active: true },
  { id: 4, name: "SQL & Bases de données", students: 15, courses: 2, completion: 30, active: false },
];

export default function ClassesPage() {
  const [search, setSearch] = useState("");

  const filtered = CLASSES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f0f1a] dark:bg-gray-50 px-8 py-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white dark:text-gray-900">Mes classes</h1>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              {CLASSES.length} classes · {CLASSES.reduce((a, c) => a + c.students, 0)} étudiants au total
            </p>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
            + Nouvelle classe
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-sm">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Rechercher une classe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a2e] dark:bg-white dark:text-gray-900 dark:shadow-sm text-white placeholder-gray-500 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Classes list */}
        <div className="flex flex-col gap-4">
          {filtered.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-16">Aucune classe trouvée.</p>
          )}
          {filtered.map((cls) => (
            <Link
              key={cls.id}
              href={`/teacher/classes/${cls.id}`}
              className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 hover:ring-2 hover:ring-green-500/50 transition-all flex flex-col gap-4"
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-600/20 flex items-center justify-center text-lg">🏫</div>
                  <div>
                    <p className="font-semibold text-white dark:text-gray-900">{cls.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {cls.students} élèves · {cls.courses} cours
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${cls.active ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                    {cls.active ? "Active" : "Archivée"}
                  </span>
                  <span className="text-green-400 font-bold text-sm">{cls.completion}%</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-20">Complétion</span>
                <div className="flex-1 h-1.5 bg-white/10 dark:bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${cls.completion}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-8 text-right">{cls.completion}%</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
