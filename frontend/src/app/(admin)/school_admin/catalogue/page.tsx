"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useSchoolStore } from "@/store/schoolStore";

const API = process.env.NEXT_PUBLIC_API_URL;

type Course = {
  id: string;
  title: string;
  visibility: string;
  created_at: string;
};

export default function AdminCataloguePage() {
  const token = useAuthStore((s) => s.token);
  const activeSchool = useSchoolStore((s) => s.activeSchool);

  const [courses, setCourses] = useState<Course[]>([]);
  const [whitelist, setWhitelist] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    const headers: HeadersInit = { Authorization: `Bearer ${token}` };

    const fetchAll = async () => {
      try {
        const [coursesRes, whitelistRes] = await Promise.all([
          fetch(`${API}/courses`, { headers }),
          activeSchool?.id
            ? fetch(`${API}/schools/${activeSchool.id}/whitelist`, { headers })
            : Promise.resolve(null),
        ]);

        if (coursesRes.ok) {
          const data: Course[] = await coursesRes.json();
          setCourses(data);
        }

        if (whitelistRes?.ok) {
          const data: Course[] = await whitelistRes.json();
          setWhitelist(new Set(data.map((c) => c.id)));
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [token, activeSchool]);

  async function toggleCourse(courseId: string) {
    if (!activeSchool?.id || toggling) return;
    setToggling(courseId);
    const isWhitelisted = whitelist.has(courseId);
    const url = `${API}/schools/${activeSchool.id}/whitelist/${courseId}`;
    const method = isWhitelisted ? "DELETE" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setWhitelist((prev) => {
          const next = new Set(prev);
          isWhitelisted ? next.delete(courseId) : next.add(courseId);
          return next;
        });
      }
    } catch {
      // ignore
    } finally {
      setToggling(null);
    }
  }

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white dark:text-gray-900">Catalogue</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Gérez les cours accessibles à votre école
        </p>
      </div>

      {!activeSchool && (
        <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 px-6 py-4">
          <p className="text-sm text-orange-400">Aucune école sélectionnée. La liste blanche ne peut pas être chargée.</p>
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

      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && (
        <div className="rounded-2xl border border-white/10 dark:border-gray-400 bg-[#111118] dark:bg-white shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 dark:border-gray-300 flex items-center justify-between bg-white/5 dark:bg-gray-50">
            <h2 className="text-sm font-semibold text-white dark:text-gray-900">Cours disponibles</h2>
            {activeSchool && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {whitelist.size} cours autorisé{whitelist.size > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {filtered.length === 0 ? (
            <p className="px-6 py-6 text-sm text-gray-500 text-center">Aucun cours trouvé.</p>
          ) : (
            <div className="divide-y divide-white/10 dark:divide-gray-300">
              {filtered.map((course) => {
                const isWhitelisted = whitelist.has(course.id);
                return (
                  <div
                    key={course.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 dark:hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-orange-600/20 flex items-center justify-center text-lg shrink-0">
                      📖
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white dark:text-gray-900 truncate">{course.title}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 capitalize">{course.visibility}</p>
                    </div>
                    {activeSchool && (
                      <button
                        onClick={() => toggleCourse(course.id)}
                        disabled={toggling === course.id}
                        className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
                          isWhitelisted
                            ? "bg-orange-500/20 text-orange-400 hover:bg-red-500/20 hover:text-red-400"
                            : "bg-white/5 text-gray-400 hover:bg-orange-500/20 hover:text-orange-400"
                        }`}
                      >
                        {toggling === course.id ? "…" : isWhitelisted ? "Autorisé ✓" : "Autoriser"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
