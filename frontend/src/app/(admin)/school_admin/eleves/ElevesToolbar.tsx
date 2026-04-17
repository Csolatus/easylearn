"use client";

import { Search } from "lucide-react";

const FILTERS = ["Tous", "A-M", "N-Z"];

interface Props {
  search: string;
  onSearch: (value: string) => void;
  activeFilter: string;
  onFilter: (filter: string) => void;
}

export function ElevesToolbar({ search, onSearch, activeFilter, onFilter }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1 max-w-sm">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none"><Search size={14} /></span>
        <input
          type="text"
          placeholder="Rechercher un élève..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full bg-surface border-2 border-white/10 dark:border-gray-400 text-foreground placeholder-gray-500 dark:placeholder-gray-400 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-md"
        />
      </div>
      <div className="flex gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilter(filter)}
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
  );
}
