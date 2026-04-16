"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import MarkdownRenderer from "@/components/course/MarkdownRenderer";

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
};

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

  // Theory
  const [mdContent, setMdContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Quiz
  const [quizId, setQuizId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<LocalQuestion[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [savingQuiz, setSavingQuiz] = useState(false);
  const [quizSaved, setQuizSaved] = useState(false);

  // Add lesson
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [addingLesson, setAddingLesson] = useState(false);
  const [addLessonError, setAddLessonError] = useState<string | null>(null);

  const selectedLesson = lessons.find((l) => l.id === selectedId) ?? null;

  // Load course + lessons
  useEffect(() => {
    if (!token || !courseId) return;
    const headers: HeadersInit = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API}/courses/${courseId}`, { headers }).then((r) => r.ok ? r.json() : null),
      fetch(`${API}/courses/${courseId}/lessons`, { headers }).then((r) => r.ok ? r.json() : []),
    ])
      .then(([c, l]) => {
        setCourse(c);
        const sorted: Lesson[] = (Array.isArray(l) ? l : []).sort(
          (a: Lesson, b: Lesson) => a.ordre - b.ordre
        );
        setLessons(sorted);
        if (sorted.length > 0) setSelectedId(sorted[0].id);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [token, courseId]);

  // Sync theory content when lesson changes
  useEffect(() => {
    setMdContent(selectedLesson?.docs ?? "");
    setQuizId(null);
    setQuestions([]);
    setSaved(false);
    setQuizSaved(false);
  }, [selectedLesson]);

  // Load quiz when switching to Quiz tab
  const loadQuiz = useCallback(async () => {
    if (!selectedId || !token) return;
    setQuizLoading(true);
    try {
      const res = await fetch(`${API}/lessons/${selectedId}/quiz`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setQuizId(data.id);
        setQuestions(
          data.questions.map((q: { id: string; statement: string; choices: { id: string; text: string; is_correct: boolean | null }[] }) => ({
            id: q.id,
            statement: q.statement,
            choices: q.choices.map((c) => ({
              text: c.text,
              isCorrect: c.is_correct ?? false,
            })),
          }))
        );
      } else if (res.status === 404) {
        setQuizId(null);
        setQuestions([]);
      }
    } catch {
      // ignore
    } finally {
      setQuizLoading(false);
    }
  }, [selectedId, token]);

  useEffect(() => {
    if (activeTab === "Quiz") loadQuiz();
  }, [activeTab, loadQuiz]);

  // Save theory (PATCH lesson docs)
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
        setLessons((prev) => prev.map((l) => (l.id === selectedId ? { ...l, docs: updated.docs } : l)));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  }

  // Save quiz (create quiz if needed, delete existing questions, recreate all)
  async function handleSaveQuiz() {
    if (!selectedId || !token) return;
    setSavingQuiz(true);
    try {
      const headers: HeadersInit = { Authorization: `Bearer ${token}` };

      // 1. Ensure quiz exists
      let currentQuizId = quizId;
      if (!currentQuizId) {
        const createRes = await fetch(`${API}/lessons/${selectedId}/quiz`, {
          method: "POST",
          headers,
        });
        if (!createRes.ok) return;
        const created = await createRes.json();
        currentQuizId = created.id;
        setQuizId(currentQuizId);
      }

      // 2. Delete existing questions (they have IDs)
      const toDelete = questions.filter((q) => q.id);
      await Promise.all(
        toDelete.map((q) =>
          fetch(`${API}/questions/${q.id}`, { method: "DELETE", headers })
        )
      );

      // 3. Re-create all questions + choices
      const created: LocalQuestion[] = [];
      for (const q of questions) {
        const qRes = await fetch(`${API}/lessons/${selectedId}/quiz/questions`, {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ statement: q.statement, ordre: created.length + 1 }),
        });
        if (!qRes.ok) continue;
        const newQ = await qRes.json();
        for (const choice of q.choices) {
          await fetch(`${API}/questions/${newQ.id}/choices`, {
            method: "POST",
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify({ text: choice.text, is_correct: choice.isCorrect }),
          });
        }
        created.push({ id: newQ.id, statement: q.statement, choices: q.choices });
      }
      setQuestions(created);
      setQuizSaved(true);
      setTimeout(() => setQuizSaved(false), 2000);
    } finally {
      setSavingQuiz(false);
    }
  }

  // Add lesson
  async function handleAddLesson() {
    if (!newLessonTitle.trim()) { setAddLessonError("Le titre est requis."); return; }
    setAddLessonError(null);
    setAddingLesson(true);
    try {
      const res = await fetch(`${API}/courses/${courseId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: newLessonTitle.trim(), ordre: lessons.length + 1 }),
      });
      if (res.ok) {
        const created: Lesson = await res.json();
        setLessons((prev) => [...prev, created]);
        setSelectedId(created.id);
        setShowAddLesson(false);
        setNewLessonTitle("");
      } else {
        const data = await res.json().catch(() => ({}));
        setAddLessonError(data.detail ?? "Erreur lors de la création.");
      }
    } catch {
      setAddLessonError("Impossible de joindre le serveur.");
    } finally {
      setAddingLesson(false);
    }
  }

  // Quiz helpers
  function addQuestion() {
    setQuestions((prev) => [
      ...prev,
      { statement: "", choices: [{ text: "", isCorrect: true }, { text: "", isCorrect: false }, { text: "", isCorrect: false }, { text: "", isCorrect: false }] },
    ]);
  }

  function updateQuestion(i: number, value: string) {
    setQuestions((prev) => prev.map((q, idx) => idx === i ? { ...q, statement: value } : q));
  }

  function updateChoice(qi: number, ci: number, value: string) {
    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === qi ? { ...q, choices: q.choices.map((c, cidx) => cidx === ci ? { ...c, text: value } : c) } : q
      )
    );
  }

  function setCorrectChoice(qi: number, ci: number) {
    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === qi
          ? { ...q, choices: q.choices.map((c, cidx) => ({ ...c, isCorrect: cidx === ci })) }
          : q
      )
    );
  }

  function removeQuestion(i: number) {
    setQuestions((prev) => prev.filter((_, idx) => idx !== i));
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-65px)] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-white/10 dark:border-gray-200 bg-[#0d0d1a] dark:bg-gray-50 flex flex-col overflow-y-auto">
        <div className="px-4 py-4 border-b border-white/10 dark:border-gray-200">
          <Link
            href="/teacher/cours"
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900 transition-colors"
          >
            ← Retour aux cours
          </Link>
          <p className="text-xs font-semibold text-white dark:text-gray-900 mt-2 truncate">
            {course?.title ?? "Chargement..."}
          </p>
          <Link
            href={`/teacher/cours/${courseId}/edit`}
            className="text-xs text-green-400 hover:text-green-300 transition-colors mt-0.5 inline-block"
          >
            ✏️ Paramètres du cours
          </Link>
        </div>

        <div className="px-3 py-3 flex-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
            Leçons
          </p>

          {lessons.length === 0 && (
            <p className="text-xs text-gray-600 px-2 py-4 text-center">Aucune leçon.</p>
          )}

          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => { setSelectedId(lesson.id); setActiveTab("Théorie"); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors mb-1 ${
                selectedId === lesson.id
                  ? "bg-green-600/20 text-green-400"
                  : "text-gray-400 dark:text-gray-500 hover:bg-white/5 dark:hover:bg-gray-100"
              }`}
            >
              <span className="text-xs truncate flex-1">{lesson.title}</span>
            </button>
          ))}

          {showAddLesson ? (
            <div className="mt-2 flex flex-col gap-2 px-2">
              <input
                value={newLessonTitle}
                onChange={(e) => setNewLessonTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddLesson()}
                placeholder="Titre de la leçon"
                autoFocus
                className="bg-white/5 dark:bg-white border border-white/20 dark:border-gray-300 text-white dark:text-gray-900 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 placeholder-gray-600"
              />
              {addLessonError && <p className="text-xs text-red-400">{addLessonError}</p>}
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowAddLesson(false); setNewLessonTitle(""); setAddLessonError(null); }}
                  className="flex-1 text-xs text-gray-500 hover:text-white transition-colors py-1"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddLesson}
                  disabled={addingLesson || !newLessonTitle.trim()}
                  className="flex-1 text-xs bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-1 rounded-lg transition-colors"
                >
                  {addingLesson ? "..." : "Ajouter"}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { setShowAddLesson(true); setNewLessonTitle(""); setAddLessonError(null); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-green-400 hover:text-green-300 transition-colors mt-2"
            >
              + Ajouter une leçon
            </button>
          )}
        </div>
      </aside>

      {/* Main editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 dark:border-gray-200 bg-[#0f0f1a] dark:bg-white shrink-0">
          <div>
            <h1 className="text-sm font-semibold text-white dark:text-gray-900">
              {selectedLesson?.title ?? "Sélectionnez une leçon"}
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Édition en cours</p>
          </div>
          {selectedLesson && (
            activeTab === "Théorie" ? (
              <button
                onClick={handleSaveTheory}
                disabled={saving}
                className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${
                  saved ? "bg-emerald-600 text-white" : "bg-green-600 hover:bg-green-700 text-white"
                } disabled:opacity-50`}
              >
                {saving ? "Sauvegarde..." : saved ? "✓ Sauvegardé" : "Sauvegarder"}
              </button>
            ) : (
              <button
                onClick={handleSaveQuiz}
                disabled={savingQuiz}
                className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${
                  quizSaved ? "bg-emerald-600 text-white" : "bg-green-600 hover:bg-green-700 text-white"
                } disabled:opacity-50`}
              >
                {savingQuiz ? "Sauvegarde..." : quizSaved ? "✓ Sauvegardé" : "Sauvegarder le quiz"}
              </button>
            )
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 dark:border-gray-200 bg-white/5 dark:bg-gray-50 shrink-0">
          {EDITOR_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? "border-green-500 text-green-400 dark:text-green-600"
                  : "border-transparent text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* No lesson selected */}
        {!selectedLesson && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Sélectionnez ou créez une leçon.</p>
          </div>
        )}

        {/* Theory tab */}
        {selectedLesson && activeTab === "Théorie" && (
          <div className="grid grid-cols-2 h-full divide-x divide-white/10 dark:divide-gray-200 overflow-hidden">
            <textarea
              value={mdContent}
              onChange={(e) => setMdContent(e.target.value)}
              placeholder="Écrivez le contenu en Markdown..."
              className="h-full bg-transparent text-white dark:text-gray-900 text-sm font-mono p-5 focus:outline-none resize-none placeholder-gray-600"
            />
            <div className="h-full overflow-y-auto p-5">
              {mdContent ? (
                <MarkdownRenderer content={mdContent} />
              ) : (
                <p className="text-gray-600 text-sm italic">La prévisualisation apparaîtra ici.</p>
              )}
            </div>
          </div>
        )}

        {/* Quiz tab */}
        {selectedLesson && activeTab === "Quiz" && (
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
            {quizLoading && (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!quizLoading && questions.map((q, qi) => (
              <div key={qi} className="flex flex-col gap-3 rounded-xl border border-white/10 dark:border-gray-200 bg-white/5 dark:bg-gray-50 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 shrink-0">Q{qi + 1}</span>
                  <input
                    value={q.statement}
                    onChange={(e) => updateQuestion(qi, e.target.value)}
                    placeholder="Écrivez votre question..."
                    className="flex-1 bg-white/5 dark:bg-white border border-white/10 dark:border-gray-300 text-white dark:text-gray-900 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
                  />
                  <button
                    onClick={() => removeQuestion(qi)}
                    className="text-gray-500 hover:text-red-400 text-sm transition-colors shrink-0"
                    aria-label="Supprimer la question"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {q.choices.map((choice, ci) => (
                    <div key={ci} className="flex items-center gap-2">
                      <button
                        onClick={() => setCorrectChoice(qi, ci)}
                        aria-label={`Sélectionner l'option ${ci + 1} comme bonne réponse`}
                        className={`w-5 h-5 rounded-full border-2 shrink-0 transition-colors ${
                          choice.isCorrect ? "border-green-500 bg-green-500" : "border-white/20 dark:border-gray-400"
                        }`}
                      />
                      <input
                        value={choice.text}
                        onChange={(e) => updateChoice(qi, ci, e.target.value)}
                        placeholder={`Option ${ci + 1}`}
                        className="flex-1 bg-white/5 dark:bg-white border border-white/10 dark:border-gray-300 text-white dark:text-gray-900 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {!quizLoading && (
              <button
                onClick={addQuestion}
                className="self-start text-xs text-green-400 hover:text-green-300 font-medium transition-colors"
              >
                + Ajouter une question
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
