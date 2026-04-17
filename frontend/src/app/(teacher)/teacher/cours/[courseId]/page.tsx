"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Spinner from "@/components/ui/Spinner";
import LessonEditorSidebar from "./LessonEditorSidebar";
import LessonEditorHeader from "./LessonEditorHeader";
import TheoryEditor from "./TheoryEditor";
import QuizBuilder from "./QuizBuilder";

const API = process.env.NEXT_PUBLIC_API_URL;

type Lesson = { id: string; title: string; docs: string | null; ordre: number };
type Course = { id: string; title: string };
type LocalChoice = { text: string; isCorrect: boolean };
type LocalQuestion = { id?: string; statement: string; choices: LocalChoice[] };

const EDITOR_TABS = ["Théorie", "Quiz"] as const;
type EditorTab = (typeof EDITOR_TABS)[number];

export default function LessonEditorPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const token = useAuthStore((s) => s.token);
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<EditorTab>("Théorie");
  const [mdContent, setMdContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<LocalQuestion[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [savingQuiz, setSavingQuiz] = useState(false);
  const [quizSaved, setQuizSaved] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [addingLesson, setAddingLesson] = useState(false);
  const [addLessonError, setAddLessonError] = useState<string | null>(null);

  const selectedLesson = lessons.find((l) => l.id === selectedId) ?? null;

  useEffect(() => {
    if (!token || !courseId) return;
    const headers: HeadersInit = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API}/courses/${courseId}`, { headers }).then((r) => r.ok ? r.json() : null),
      fetch(`${API}/courses/${courseId}/lessons`, { headers }).then((r) => r.ok ? r.json() : []),
    ])
      .then(([c, l]) => {
        setCourse(c);
        const sorted: Lesson[] = (Array.isArray(l) ? l : []).sort((a: Lesson, b: Lesson) => a.ordre - b.ordre);
        setLessons(sorted);
        if (sorted.length > 0) setSelectedId(sorted[0].id);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [token, courseId]);

  useEffect(() => {
    setMdContent(selectedLesson?.docs ?? "");
    setQuizId(null); setQuestions([]); setSaved(false); setQuizSaved(false);
  }, [selectedLesson]);

  const loadQuiz = useCallback(async () => {
    if (!selectedId || !token) return;
    setQuizLoading(true);
    try {
      const res = await fetch(`${API}/lessons/${selectedId}/quiz`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setQuizId(data.id);
        setQuestions(data.questions.map((q: { id: string; statement: string; choices: { id: string; text: string; is_correct: boolean | null }[] }) => ({
          id: q.id, statement: q.statement,
          choices: q.choices.map((c) => ({ text: c.text, isCorrect: c.is_correct ?? false })),
        })));
      } else if (res.status === 404) { setQuizId(null); setQuestions([]); }
    } catch { /* ignore */ } finally { setQuizLoading(false); }
  }, [selectedId, token]);

  useEffect(() => { if (activeTab === "Quiz") loadQuiz(); }, [activeTab, loadQuiz]);

  async function handleSaveTheory() {
    if (!selectedId || !token) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/courses/${courseId}/lessons/${selectedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ docs: mdContent || null }),
      });
      if (res.ok) {
        const updated: Lesson = await res.json();
        setLessons((prev) => prev.map((l) => l.id === selectedId ? { ...l, docs: updated.docs } : l));
        setSaved(true); setTimeout(() => setSaved(false), 2000);
      }
    } finally { setSaving(false); }
  }

  async function handleSaveQuiz() {
    if (!selectedId || !token) return;
    setSavingQuiz(true);
    try {
      const headers: HeadersInit = { Authorization: `Bearer ${token}` };
      let currentQuizId = quizId;
      if (!currentQuizId) {
        const createRes = await fetch(`${API}/lessons/${selectedId}/quiz`, { method: "POST", headers });
        if (!createRes.ok) return;
        const created = await createRes.json(); currentQuizId = created.id; setQuizId(currentQuizId);
      }
      await Promise.all(questions.filter((q) => q.id).map((q) => fetch(`${API}/questions/${q.id}`, { method: "DELETE", headers })));
      const created: LocalQuestion[] = [];
      for (const q of questions) {
        const qRes = await fetch(`${API}/lessons/${selectedId}/quiz/questions`, {
          method: "POST", headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ statement: q.statement, ordre: created.length + 1 }),
        });
        if (!qRes.ok) continue;
        const newQ = await qRes.json();
        for (const choice of q.choices) {
          await fetch(`${API}/questions/${newQ.id}/choices`, {
            method: "POST", headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify({ text: choice.text, is_correct: choice.isCorrect }),
          });
        }
        created.push({ id: newQ.id, statement: q.statement, choices: q.choices });
      }
      setQuestions(created); setQuizSaved(true); setTimeout(() => setQuizSaved(false), 2000);
    } finally { setSavingQuiz(false); }
  }

  async function handleAddLesson() {
    if (!newLessonTitle.trim()) { setAddLessonError("Le titre est requis."); return; }
    setAddLessonError(null); setAddingLesson(true);
    try {
      const res = await fetch(`${API}/courses/${courseId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: newLessonTitle.trim(), ordre: lessons.length + 1 }),
      });
      if (res.ok) {
        const created: Lesson = await res.json();
        setLessons((prev) => [...prev, created]); setSelectedId(created.id); setShowAddLesson(false); setNewLessonTitle("");
      } else { const data = await res.json().catch(() => ({})); setAddLessonError(data.detail ?? "Erreur lors de la création."); }
    } catch { setAddLessonError("Impossible de joindre le serveur."); }
    finally { setAddingLesson(false); }
  }

  if (isLoading) return <div className="flex justify-center py-20"><Spinner color="border-green-500" /></div>;

  return (
    <div className="flex h-[calc(100vh-65px)] overflow-hidden">
      <LessonEditorSidebar
        courseId={courseId}
        courseTitle={course?.title ?? null}
        lessons={lessons}
        selectedId={selectedId}
        showAddLesson={showAddLesson}
        newLessonTitle={newLessonTitle}
        addingLesson={addingLesson}
        addLessonError={addLessonError}
        onSelectLesson={(id) => { setSelectedId(id); setActiveTab("Théorie"); }}
        onShowAdd={() => { setShowAddLesson(true); setNewLessonTitle(""); setAddLessonError(null); }}
        onHideAdd={() => { setShowAddLesson(false); setNewLessonTitle(""); setAddLessonError(null); }}
        onNewTitleChange={setNewLessonTitle}
        onAddLesson={handleAddLesson}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <LessonEditorHeader
          lessonTitle={selectedLesson?.title ?? null}
          activeTab={activeTab}
          saving={saving} saved={saved}
          savingQuiz={savingQuiz} quizSaved={quizSaved}
          onSaveTheory={handleSaveTheory}
          onSaveQuiz={handleSaveQuiz}
        />

        <div className="flex border-b border-border bg-white/5 shrink-0">
          {EDITOR_TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === tab ? "border-green-500 text-green-400 dark:text-green-600" : "border-transparent text-muted hover:text-foreground"}`}>
              {tab}
            </button>
          ))}
        </div>

        {!selectedLesson && <div className="flex-1 flex items-center justify-center"><p className="text-gray-500 text-sm">Sélectionnez ou créez une leçon.</p></div>}
        {selectedLesson && activeTab === "Théorie" && <TheoryEditor content={mdContent} onChange={setMdContent} />}
        {selectedLesson && activeTab === "Quiz" && (
          <QuizBuilder
            questions={questions} loading={quizLoading}
            onAddQuestion={() => setQuestions((prev) => [...prev, { statement: "", choices: [{ text: "", isCorrect: true }, { text: "", isCorrect: false }, { text: "", isCorrect: false }, { text: "", isCorrect: false }] }])}
            onUpdateQuestion={(i, v) => setQuestions((prev) => prev.map((q, idx) => idx === i ? { ...q, statement: v } : q))}
            onUpdateChoice={(qi, ci, v) => setQuestions((prev) => prev.map((q, idx) => idx === qi ? { ...q, choices: q.choices.map((c, cidx) => cidx === ci ? { ...c, text: v } : c) } : q))}
            onSetCorrect={(qi, ci) => setQuestions((prev) => prev.map((q, idx) => idx === qi ? { ...q, choices: q.choices.map((c, cidx) => ({ ...c, isCorrect: cidx === ci })) } : q))}
            onRemoveQuestion={(i) => setQuestions((prev) => prev.filter((_, idx) => idx !== i))}
          />
        )}
      </div>
    </div>
  );
}
