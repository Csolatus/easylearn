"use client";

import { useState } from "react";

export default function AdminCataloguePage() {
  const [isRestricted, setIsRestricted] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white dark:text-gray-900">Catalogue</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Gérez les cours accessibles à votre école
        </p>
      </div>

      <div className="rounded-2xl border border-white/5 dark:border-gray-200 bg-[#111118] dark:bg-white px-6 py-5 flex items-center justify-between gap-4">
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
            isRestricted ? "bg-orange-500" : "bg-white/10 dark:bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
              isRestricted ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      <div className="relative w-full max-w-sm">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Rechercher un cours..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111118] dark:bg-white border border-white/5 dark:border-gray-200 text-white dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-400 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
    </div>
  );
}
