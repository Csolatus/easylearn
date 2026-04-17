"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Spinner from "@/components/ui/Spinner";
import CourseInfoForm from "./CourseInfoForm";
import LessonSettingsList from "./LessonSettingsList";

const API = process.env.NEXT_PUBLIC_API_URL;

type Lesson = { id: string; title: string; docs: string | null; ordre: number };
type Course = { id: string; title: string; visibility: "public" | "school" | "private" };

export default function CourseEditPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
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

  async function handleDeleteCourse() {
    setDeleting(true);
    try {
      const res = await fetch(`${API}/courses/${courseId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) router.push("/teacher/cours");
    } finally { setDeleting(false); }
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
            {saving ? "Sauvegarde..." : saved ? "Sauvegardé" : "Sauvegarder"}
          </button>
        </div>

        <CourseInfoForm title={title} visibility={visibility} onTitleChange={setTitle} onVisibilityChange={setVisibility} />

        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-red-400">Supprimer le cours</p>
            <p className="text-xs text-muted mt-0.5">Cette action est irréversible. Toutes les leçons, quiz et exercices seront supprimés.</p>
          </div>
          {confirmDelete ? (
            <div className="flex gap-2 shrink-0">
              <button onClick={handleDeleteCourse} disabled={deleting}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-semibold transition-colors">
                {deleting ? "Suppression..." : "Confirmer"}
              </button>
              <button onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 rounded-xl border border-border text-muted hover:text-foreground text-xs transition-colors">
                Annuler
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition-colors shrink-0">
              <Trash2 size={13} /> Supprimer
            </button>
          )}
        </div>

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
