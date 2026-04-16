"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

const API = process.env.NEXT_PUBLIC_API_URL;

type Tab = "cours" | "info";

type Classroom = {
  id: string;
  name: string;
  school_id: string | null;
  invite_code: string;
  is_archived: boolean;
  created_at: string;
};

type Course = {
  id: string;
  title: string;
  visibility: string;
};

export default function ClassDetailPage() {
  const { classId } = useParams<{ classId: string }>();
  const token = useAuthStore((s) => s.token);

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("cours");
  const [toggling, setToggling] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token || !classId) return;
    const headers: HeadersInit = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API}/classrooms/${classId}`, { headers }).then((r) => r.ok ? r.json() : null),
      fetch(`${API}/courses`, { headers }).then((r) => r.ok ? r.json() : []),
    ])
      .then(([cls, courses]) => {
        setClassroom(cls);
        setMyCourses(Array.isArray(courses) ? courses : []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [token, classId]);

  async function toggleCourse(courseId: string) {
    if (toggling) return;
    setToggling(courseId);
    const isAssigned = assignedIds.has(courseId);
    try {
      let res: Response;
      if (isAssigned) {
        res = await fetch(`${API}/classrooms/${classId}/courses/${courseId}`, {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
      } else {
        res = await fetch(`${API}/classrooms/${classId}/courses?course_id=${courseId}`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
      }
      if (res.ok) {
        setAssignedIds((prev) => {
          const next = new Set(prev);
          isAssigned ? next.delete(courseId) : next.add(courseId);
          return next;
        });
      }
    } finally {
      setToggling(null);
    }
  }

  async function copyCode() {
    if (!classroom?.invite_code) return;
    await navigator.clipboard.writeText(classroom.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: "cours", label: "Cours assignés" },
    { key: "info", label: "Informations" },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] dark:bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Classe introuvable.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] dark:bg-gray-50 px-8 py-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div>
          <Link href="/teacher/classes" className="text-gray-400 hover:text-white dark:hover:text-gray-900 text-xs transition-colors mb-3 inline-block">
            ← Retour aux classes
          </Link>
          <h1 className="text-3xl font-bold text-white dark:text-gray-900">{classroom.name}</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1 flex items-center gap-3">
            <span className="font-mono text-green-400">{classroom.invite_code}</span>
            <button onClick={copyCode} className="text-xs text-gray-500 hover:text-white transition-colors">
              {copied ? "Copié !" : "Copier"}
            </button>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              classroom.is_archived ? "bg-gray-500/20 text-gray-400" : "bg-green-500/20 text-green-400"
            }`}>
              {classroom.is_archived ? "Archivée" : "Active"}
            </span>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-green-600 text-white"
                  : "bg-white/5 dark:bg-gray-100 text-gray-400 dark:text-gray-600 hover:bg-white/10 dark:hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab — Cours */}
        {activeTab === "cours" && (
          <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white dark:text-gray-900">
                Mes cours
              </h2>
              <span className="text-xs text-gray-400">{assignedIds.size} assigné{assignedIds.size > 1 ? "s" : ""}</span>
            </div>
            <p className="text-xs text-gray-500">Cochez les cours à rendre accessibles à cette classe.</p>

            {myCourses.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <p className="text-gray-500 text-sm">Aucun cours créé.</p>
                <Link href="/teacher/cours" className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors">
                  Créer un cours →
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {myCourses.map((course) => {
                  const isAssigned = assignedIds.has(course.id);
                  return (
                    <div key={course.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 dark:bg-gray-50">
                      <span className="text-sm text-white dark:text-gray-900 flex-1 truncate">{course.title}</span>
                      <span className="text-xs text-gray-500 capitalize">{course.visibility}</span>
                      <button
                        onClick={() => toggleCourse(course.id)}
                        disabled={toggling === course.id}
                        className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
                          isAssigned
                            ? "bg-green-500/20 text-green-400 hover:bg-red-500/20 hover:text-red-400"
                            : "bg-white/5 text-gray-400 hover:bg-green-500/20 hover:text-green-400"
                        }`}
                      >
                        {toggling === course.id ? "…" : isAssigned ? "Assigné ✓" : "Assigner"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab — Informations */}
        {activeTab === "info" && (
          <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-semibold text-white dark:text-gray-900">Informations de la classe</h2>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center py-2 border-b border-white/5 dark:border-gray-100">
                <span className="text-xs text-gray-400 uppercase tracking-wider">Nom</span>
                <span className="text-sm text-white dark:text-gray-900 font-medium">{classroom.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5 dark:border-gray-100">
                <span className="text-xs text-gray-400 uppercase tracking-wider">Code d&apos;invitation</span>
                <span className="font-mono text-green-400 text-sm font-bold">{classroom.invite_code}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5 dark:border-gray-100">
                <span className="text-xs text-gray-400 uppercase tracking-wider">Statut</span>
                <span className={`text-sm font-medium ${classroom.is_archived ? "text-gray-400" : "text-green-400"}`}>
                  {classroom.is_archived ? "Archivée" : "Active"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-xs text-gray-400 uppercase tracking-wider">Créée le</span>
                <span className="text-sm text-white dark:text-gray-900">
                  {new Date(classroom.created_at).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
