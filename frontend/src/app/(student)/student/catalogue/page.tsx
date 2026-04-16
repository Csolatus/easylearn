"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import SearchInput from "@/components/ui/SearchInput";
import CatalogueGrid from "./CatalogueGrid";

const API = process.env.NEXT_PUBLIC_API_URL;
type Course = { id: string; title: string; visibility: string; created_at: string };

export default function CataloguePage() {
  const token = useAuthStore((s) => s.token);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API}/courses`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then((res) => { if (!res.ok) throw new Error("Impossible de charger les cours"); return res.json(); })
      .then((data: Course[]) => setCourses(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [token]);

  const filtered = courses.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0f0f1a] dark:bg-gray-50 text-white dark:text-gray-900 px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-2">
          <div>
            <h1 className="text-4xl font-bold">Explore Knowledge</h1>
            <p className="text-gray-400 text-sm mt-2">Découvrez tous les cours disponibles sur EasyLearn.</p>
          </div>
          {!isLoading && !error && (
            <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm px-5 py-3 rounded-xl text-center">
              <p className="text-xl font-bold text-purple-400">{courses.length}</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Total Courses</p>
            </div>
          )}
        </div>
        <div className="mt-6 max-w-md">
          <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un cours..." />
        </div>
        <div className="mt-8">
          <CatalogueGrid courses={filtered} isLoading={isLoading} error={error} />
        </div>
      </div>
    </div>
  );
}
