"use client";

import { useState } from "react";

const FILTERS = ["Tous", "Actif", "Inactif"];

export default function ElevesPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");

  return (
    <div className="px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white dark:text-gray-900">Élèves</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Gérez les élèves de votre école
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Rechercher un élève..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111118] dark:bg-white border-2 border-white/10 dark:border-gray-400 text-white dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-400 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-md"
          />
        </div>
        <div className="flex gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? "bg-orange-600 text-white"
                  : "bg-white/5 dark:bg-gray-100 text-gray-400 dark:text-gray-600 hover:bg-white/10 dark:hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
