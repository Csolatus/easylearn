"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

const API = process.env.NEXT_PUBLIC_API_URL;

type Course = {
  id: string;
  title: string;
  visibility: string;
  created_at: string;
};

function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/student/cours/${course.id}`}
      className="bg-[#1a1a2e] dark:bg-white rounded-2xl overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all flex flex-col"
    >
      <div className="h-36 bg-gradient-to-br from-purple-900 to-blue-900 dark:from-purple-200 dark:to-blue-200 flex items-center justify-center">
        <span className="text-4xl">📚</span>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            course.visibility === "public"
              ? "bg-green-500/20 text-green-400"
              : course.visibility === "school"
              ? "bg-blue-500/20 text-blue-400"
              : "bg-gray-500/20 text-gray-400"
          }`}>
            {course.visibility}
          </span>
        </div>
        <h3 className="font-semibold text-white dark:text-gray-900 text-sm leading-snug">
          {course.title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-auto">
          Ajouté le {new Date(course.created_at).toLocaleDateString("fr-FR")}
        </p>
      </div>
    </Link>
  );
}

export default function CataloguePage() {
  const token = useAuthStore((s) => s.token);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API}/courses`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error("Impossible de charger les cours");
        return res.json();
      })
      .then((data: Course[]) => setCourses(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [token]);

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f0f1a] dark:bg-gray-50 text-white dark:text-gray-900 px-8 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-2">
          <div>
            <h1 className="text-4xl font-bold">Explore Knowledge</h1>
            <p className="text-gray-400 text-sm mt-2">
              Découvrez tous les cours disponibles sur EasyLearn.
            </p>
          </div>
          {!isLoading && !error && (
            <div className="flex gap-6 text-center">
              <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm px-5 py-3 rounded-xl">
                <p className="text-xl font-bold text-purple-400">{courses.length}</p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Total Courses</p>
              </div>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="mt-6 relative w-full max-w-md">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Rechercher un cours..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a2e] dark:bg-white dark:text-gray-900 dark:shadow-sm text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Content */}
        <div className="mt-8">
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center gap-3 py-20">
              <p className="text-red-400 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-xs text-purple-400 hover:text-purple-300"
              >
                Réessayer
              </button>
            </div>
          )}

          {!isLoading && !error && filtered.length === 0 && (
            <p className="text-center text-gray-500 py-20">Aucun cours trouvé.</p>
          )}

          {!isLoading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
