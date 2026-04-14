"use client";

import { useState } from "react";

export default function CataloguePage() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Explore Knowledge</h1>
        <p className="text-gray-400 text-sm">
          More than 1,000 courses to build your skills designed for the future
          of industry and technology.
        </p>
        <div className="mt-6 relative w-full max-w-md">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a2e] text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
    </div>
  );
}
