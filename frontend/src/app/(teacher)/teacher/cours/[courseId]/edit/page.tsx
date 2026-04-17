"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import Spinner from "@/components/ui/Spinner";
import CourseInfoForm from "./CourseInfoForm";
import LessonSettingsList from "./LessonSettingsList";

const API = process.env.NEXT_PUBLIC_API_URL;

type Lesson = { id: string; title: string; docs: string | null; ordre: number };
type Course = { id: string; title: string; visibility: "public" | "school" | "private" };

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
        if (c) { setCourse(c); setTitle(c.title); setVisibility(c.visibility); }
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
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
    } finally { setSaving(false); }
  }

  async function handleAddLesson() {
    if (!newLessonTitle.trim()) { setLessonError("Le titre est requis."); return; }
    setLessonError(null); setAddingLesson(true);
    try {
      const res = await fetch(`${API}/courses/${courseId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: newLessonTitle.trim(), docs: newLessonDocs.trim() || null, ordre: lessons.length + 1 }),
      });
      if (res.ok) {
        const created: Lesson = await res.json();
        setLessons((prev) => [...prev, created]); setShowAddLesson(false); setNewLessonTitle(""); setNewLessonDocs("");
      } else { const data = await res.json().catch(() => ({})); setLessonError(data.detail ?? "Erreur lors de la création."); }
    } catch { setLessonError("Impossible de joindre le serveur."); }
    finally { setAddingLesson(false); }
  }

  async function handleDeleteLesson(lessonId: string) {
    setDeletingLesson(lessonId);
    try {
      const res = await fetch(`${API}/courses/${courseId}/lessons/${lessonId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    } finally { setDeletingLesson(null); }
  }

  if (isLoading) return <div className="flex justify-center py-20"><Spinner color="border-green-500" /></div>;

  return (
    <div className="px-6 py-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <Link href="/teacher/cours" className="text-gray-400 hover:text-foreground text-xs transition-colors mb-3 inline-block">← Retour aux cours</Link>
            <h1 className="text-3xl font-bold text-foreground">Modifier le cours</h1>
            {course && <p className="text-muted text-sm mt-1">{course.id}</p>}
          </div>
          <button onClick={handleSave} disabled={saving || !title.trim()}
            className={`text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50 ${saved ? "bg-emerald-600 text-white" : "bg-green-600 hover:bg-green-700 text-white"}`}>
            {saving ? "Sauvegarde..." : saved ? "✓ Sauvegardé" : "Sauvegarder"}
          </button>
        </div>

        <CourseInfoForm title={title} visibility={visibility} onTitleChange={setTitle} onVisibilityChange={setVisibility} />

        <LessonSettingsList
          lessons={lessons} deletingLesson={deletingLesson}
          showAddForm={showAddLesson} newTitle={newLessonTitle} newDocs={newLessonDocs}
          addingLesson={addingLesson} lessonError={lessonError}
          onShowAdd={() => { setShowAddLesson(true); setNewLessonTitle(""); setNewLessonDocs(""); setLessonError(null); }}
          onHideAdd={() => setShowAddLesson(false)}
          onNewTitleChange={setNewLessonTitle}
          onNewDocsChange={setNewLessonDocs}
          onAddLesson={handleAddLesson}
          onDeleteLesson={handleDeleteLesson}
        />
      </div>
    </div>
  );
}
