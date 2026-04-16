"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

const API = process.env.NEXT_PUBLIC_API_URL;

type Lesson = {
  id: string;
  title: string;
  docs: string | null;
  ordre: number;
};

type Course = {
  id: string;
  title: string;
  visibility: "public" | "school" | "private";
};

export default function CourseEditPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const token = useAuthStore((s) => s.token);

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState<"public" | "school" | "private">("private");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Add lesson modal
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonDocs, setNewLessonDocs] = useState("");
  const [addingLesson, setAddingLesson] = useState(false);
  const [lessonError, setLessonError] = useState<string | null>(null);

  const [deletingLesson, setDeletingLesson] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !courseId) return;
    const headers: HeadersInit = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API}/courses/${courseId}`, { headers }).then((r) => r.ok ? r.json() : null),
      fetch(`${API}/courses/${courseId}/lessons`, { headers }).then((r) => r.ok ? r.json() : []),
    ])
      .then(([c, l]) => {
        if (c) {
          setCourse(c);
          setTitle(c.title);
          setVisibility(c.visibility);
        }
        setLessons(Array.isArray(l) ? l.sort((a: Lesson, b: Lesson) => a.ordre - b.ordre) : []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [token, courseId]);

  async function handleSave() {
    if (!title.trim() || !token) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: title.trim(), visibility }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleAddLesson() {
    if (!newLessonTitle.trim()) { setLessonError("Le titre est requis."); return; }
    setLessonError(null);
    setAddingLesson(true);
    try {
      const res = await fetch(`${API}/courses/${courseId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: newLessonTitle.trim(),
          docs: newLessonDocs.trim() || null,
          ordre: lessons.length + 1,
        }),
      });
      if (res.ok) {
        const created: Lesson = await res.json();
        setLessons((prev) => [...prev, created]);
        setShowAddLesson(false);
        setNewLessonTitle("");
        setNewLessonDocs("");
      } else {
        const data = await res.json().catch(() => ({}));
        setLessonError(data.detail ?? "Erreur lors de la création.");
      }
    } catch {
      setLessonError("Impossible de joindre le serveur.");
    } finally {
      setAddingLesson(false);
    }
  }

  async function handleDeleteLesson(lessonId: string) {
    setDeletingLesson(lessonId);
    try {
      const res = await fetch(`${API}/courses/${courseId}/lessons/${lessonId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setLessons((prev) => prev.filter((l) => l.id !== lessonId));
      }
    } finally {
      setDeletingLesson(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <Link href="/teacher/cours" className="text-gray-400 hover:text-white dark:hover:text-gray-900 text-xs transition-colors mb-3 inline-block">
              ← Retour aux cours
            </Link>
            <h1 className="text-3xl font-bold text-white dark:text-gray-900">Modifier le cours</h1>
            {course && <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">{course.id}</p>}
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className={`text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50 ${
              saved ? "bg-emerald-600 text-white" : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {saving ? "Sauvegarde..." : saved ? "✓ Sauvegardé" : "Sauvegarder"}
          </button>
        </div>

        {/* Course info */}
        <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-5">
          <h2 className="font-semibold text-white dark:text-gray-900">Informations générales</h2>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase">Titre</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/5 dark:bg-gray-100 border border-white/10 dark:border-gray-200 text-white dark:text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase">Visibilité</label>
            <div className="flex gap-3 flex-wrap">
              {(["private", "school", "public"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setVisibility(v)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-colors ${
                    visibility === v
                      ? "border-green-500 bg-green-500/10 text-green-400"
                      : "border-white/10 dark:border-gray-200 text-gray-400 hover:border-green-500/50"
                  }`}
                >
                  {v === "public" ? "🌍 Public" : v === "school" ? "🏫 École" : "🔒 Privé"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lessons */}
        <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white dark:text-gray-900">Leçons ({lessons.length})</h2>
            <button
              onClick={() => { setShowAddLesson(true); setNewLessonTitle(""); setNewLessonDocs(""); setLessonError(null); }}
              className="text-green-400 hover:text-green-300 text-xs font-medium transition-colors"
            >
              + Ajouter une leçon
            </button>
          </div>

          {lessons.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">Aucune leçon. Commencez par en ajouter une.</p>
          )}

          <div className="flex flex-col gap-2">
            {lessons.map((lesson, i) => (
              <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 dark:bg-gray-50 group">
                <span className="text-gray-500 text-xs w-4">{i + 1}</span>
                <span className="text-sm text-white dark:text-gray-900 flex-1 truncate">{lesson.title}</span>
                {lesson.docs && (
                  <span className="text-xs text-gray-500 hidden group-hover:block truncate max-w-32">📄 docs</span>
                )}
                <button
                  onClick={() => handleDeleteLesson(lesson.id)}
                  disabled={deletingLesson === lesson.id}
                  className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 text-xs transition-all disabled:opacity-30"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Add lesson form */}
          {showAddLesson && (
            <div className="flex flex-col gap-3 p-4 rounded-xl border border-green-500/30 bg-green-500/5 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-400">Titre de la leçon *</label>
                <input
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  placeholder="ex: Introduction aux variables"
                  autoFocus
                  className="bg-white/5 dark:bg-gray-100 border border-white/10 dark:border-gray-200 text-white dark:text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-400">Contenu / docs (Markdown)</label>
                <textarea
                  value={newLessonDocs}
                  onChange={(e) => setNewLessonDocs(e.target.value)}
                  placeholder="Contenu de la leçon en Markdown..."
                  rows={4}
                  className="bg-white/5 dark:bg-gray-100 border border-white/10 dark:border-gray-200 text-white dark:text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 resize-none"
                />
              </div>
              {lessonError && <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{lessonError}</p>}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddLesson(false)}
                  className="flex-1 text-sm text-gray-400 hover:text-white transition-colors py-2"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddLesson}
                  disabled={addingLesson || !newLessonTitle.trim()}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-xl transition-colors"
                >
                  {addingLesson ? "Ajout..." : "Ajouter"}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
