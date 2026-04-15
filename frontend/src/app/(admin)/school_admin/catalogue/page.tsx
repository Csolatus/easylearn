"use client";

import { useState } from "react";

const ALL_COURSES = [
  { id: 1, title: "Introduction au JavaScript", category: "Web Development", icon: "🌐" },
  { id: 2, title: "Python pour la Data Science", category: "Data Science", icon: "🐍" },
  { id: 3, title: "Les bases du Machine Learning", category: "AI & ML", icon: "🤖" },
  { id: 4, title: "HTML & CSS Avancé", category: "Web Development", icon: "🎨" },
  { id: 5, title: "React de A à Z", category: "Web Development", icon: "⚛️" },
  { id: 6, title: "Bases de données SQL", category: "Data Science", icon: "🗄️" },
  { id: 7, title: "Deep Learning avec TensorFlow", category: "AI & ML", icon: "🧠" },
  { id: 8, title: "Node.js & Express", category: "Web Development", icon: "🟢" },
];

export default function AdminCataloguePage() {
  const [isRestricted, setIsRestricted] = useState(false);
  const [search, setSearch] = useState("");
  const [whitelist, setWhitelist] = useState<number[]>([]);

  const filtered = ALL_COURSES.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCourse = (id: number) => {
    setWhitelist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white dark:text-gray-900">Catalogue</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Gérez les cours accessibles à votre école
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 dark:border-gray-400 bg-[#111118] dark:bg-white shadow-md px-6 py-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white dark:text-gray-900">
            Mode d&apos;accès
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {isRestricted
              ? "Accès restreint — seuls les cours cochés sont visibles par vos élèves"
              : "Accès libre — tous les cours du catalogue sont visibles par vos élèves"}
          </p>
        </div>
        <button
          onClick={() => setIsRestricted(!isRestricted)}
          aria-label={isRestricted ? "Désactiver l'accès restreint" : "Activer l'accès restreint"}
          className={`relative shrink-0 w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
            isRestricted ? "bg-orange-500" : "bg-white/20 dark:bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white dark:bg-gray-600 rounded-full shadow-md transition-transform duration-300 ${
              isRestricted ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {isRestricted && (
        <div className="rounded-2xl border border-white/10 dark:border-gray-400 bg-[#111118] dark:bg-white shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 dark:border-gray-300 flex items-center justify-between bg-white/5 dark:bg-gray-50">
            <h2 className="text-sm font-semibold text-white dark:text-gray-900">Cours autorisés</h2>
            <span className="text-xs text-gray-400 dark:text-gray-500">{whitelist.length} sélectionné(s)</span>
          </div>
          <div className="divide-y divide-white/10 dark:divide-gray-300">
            {filtered.length === 0 ? (
              <p className="px-6 py-6 text-sm text-gray-500 text-center">Aucun cours trouvé.</p>
            ) : (
              filtered.map((course) => {
                const checked = whitelist.includes(course.id);
                return (
                  <label
                    key={course.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 dark:hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCourse(course.id)}
                      className="w-4 h-4 accent-orange-500 shrink-0"
                    />
                    <div className="w-9 h-9 rounded-xl bg-orange-600/20 flex items-center justify-center text-lg shrink-0">
                      {course.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white dark:text-gray-900 truncate">{course.title}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{course.category}</p>
                    </div>
                    {checked && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 dark:text-orange-600 shrink-0">
                        Autorisé
                      </span>
                    )}
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}

      <div className="relative w-full max-w-sm">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Rechercher un cours..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111118] dark:bg-white border-2 border-white/10 dark:border-gray-400 text-white dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-400 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-md"
        />
      </div>
    </div>
  );
}
