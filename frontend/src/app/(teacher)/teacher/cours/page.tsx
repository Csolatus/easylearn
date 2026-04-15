"use client";

import { useState } from "react";

const TABS = [
  { label: "Tous", value: "all" },
  { label: "Publié", value: "published" },
  { label: "Brouillon", value: "draft" },
  { label: "Archivé", value: "archived" },
];

export default function CoursPage() {
  const [activeTab, setActiveTab] = useState("all");

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
    </div>
  );
}
