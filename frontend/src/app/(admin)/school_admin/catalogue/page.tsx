"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useSchoolStore } from "@/store/schoolStore";
import { CatalogueList } from "./CatalogueList";
import { Search } from "lucide-react";

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
        if (coursesRes.ok) setCourses(await coursesRes.json());
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
    try {
      const res = await fetch(url, {
        method: isWhitelisted ? "DELETE" : "POST",
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
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none"><Search size={14} /></span>
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
        <CatalogueList
          courses={filtered}
          whitelist={whitelist}
          toggling={toggling}
          hasActiveSchool={!!activeSchool}
          whitelistCount={whitelist.size}
          onToggle={toggleCourse}
        />
      )}
    </div>
  );
}
