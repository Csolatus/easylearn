"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import LessonSidebar, { type Lesson } from "@/components/course/LessonSidebar";
import TheoryTab from "@/components/course/TheoryTab";
import PracticeTab from "@/components/course/PracticeTab";

const API = process.env.NEXT_PUBLIC_API_URL;

type BackendLesson = {
  id: string;
  course_id: string;
  title: string;
  docs: string | null;
  ordre: number;
  updated_at: string;
};

type BackendCourse = {
  id: string;
  title: string;
  visibility: string;
};

type BackendChoice = {
  id: string;
  text: string;
  is_correct?: boolean | null;
};

type BackendQuestion = {
  id: string;
  statement: string;
  ordre: number;
  choices: BackendChoice[];
};

type BackendQuiz = {
  id: string;
  lesson_id: string;
  questions: BackendQuestion[];
};

type LessonProgress = {
  lesson_id: string;
  completed: boolean;
};

const DEFAULT_CODE = `// Sandbox — écrivez votre code ici
console.log("Hello, EasyLearn!");
`;

export default function LessonPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  const [course, setCourse] = useState<BackendCourse | null>(null);
  const [lessons, setLessons] = useState<BackendLesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<BackendLesson | null>(null);
  const [quizData, setQuizData] = useState<BackendQuiz | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Théorie");

  // Quiz state
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null); // 0-1
  const [quizSubmitting, setQuizSubmitting] = useState(false);

  useEffect(() => {
    if (!courseId || !lessonId) return;
    setIsLoading(true);
    setError(null);
    setActiveTab("Théorie");
    setSelectedChoices({});
    setQuizScore(null);
    setQuizData(null);

    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

    Promise.all([
      fetch(`${API}/courses/${courseId}`, { headers }),
      fetch(`${API}/courses/${courseId}/lessons`, { headers }),
      fetch(`${API}/courses/${courseId}/progress/me`, { headers }),
      fetch(`${API}/courses/${courseId}/lessons/${lessonId}`, { headers }),
    ])
      .then(async ([courseRes, lessonsRes, progressRes, lessonRes]) => {
        if (!courseRes.ok) throw new Error("Cours introuvable");
        if (!lessonsRes.ok) throw new Error("Impossible de charger les leçons");
        if (!lessonRes.ok) throw new Error("Leçon introuvable");

        const [courseData, lessonsData, lessonData]: [BackendCourse, BackendLesson[], BackendLesson] =
          await Promise.all([courseRes.json(), lessonsRes.json(), lessonRes.json()]);

        lessonsData.sort((a, b) => a.ordre - b.ordre);

        const completed = new Set<string>();
        if (progressRes.ok) {
          const progressData = await progressRes.json();
          for (const lp of progressData.lessons as LessonProgress[]) {
            if (lp.completed) completed.add(lp.lesson_id);
          }
        }

        setCourse(courseData);
        setLessons(lessonsData);
        setCurrentLesson(lessonData);
        setCompletedIds(completed);

        // Fetch quiz (may 404)
        return fetch(`${API}/lessons/${lessonId}/quiz`, { headers });
      })
      .then(async (quizRes) => {
        if (quizRes.ok) {
          const quiz: BackendQuiz = await quizRes.json();
          if (quiz.questions.length > 0) setQuizData(quiz);
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      })
      .finally(() => setIsLoading(false));
  }, [courseId, lessonId, token]);

  const markComplete = async () => {
    if (completedIds.has(lessonId)) return;
    try {
      const res = await fetch(`${API}/lessons/${lessonId}/complete`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setCompletedIds((prev) => new Set([...prev, lessonId]));
      }
    } catch {
      // silent
    }
  };

  const handleTheoryProgress = (progress: number) => {
    if (progress >= 90) markComplete();
  };

  const handleLessonChange = (numericId: number) => {
    const lesson = lessons[numericId - 1];
    if (lesson) router.push(`/student/cours/${courseId}/${lesson.id}`);
  };

  const handleQuizSubmit = async () => {
    if (!quizData) return;
    const allAnswered = quizData.questions.every((q) => selectedChoices[q.id]);
    if (!allAnswered || quizSubmitting) return;
    setQuizSubmitting(true);
    try {
      const answers = quizData.questions.map((q) => ({
        question_id: q.id,
        choice_id: selectedChoices[q.id],
      }));
      const res = await fetch(`${API}/lessons/${lessonId}/quiz/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ answers }),
      });
      const result = res.ok ? await res.json() : { score: 0 };
      setQuizScore(result.score ?? 0);
      if ((result.score ?? 0) >= 0.5) markComplete();
    } catch {
      setQuizScore(0);
    } finally {
      setQuizSubmitting(false);
    }
  };

  const sidebarLessons: Lesson[] = lessons.map((l, idx) => ({
    id: idx + 1,
    title: l.title,
    type: "theory" as const,
    done: completedIds.has(l.id),
  }));

  const activeLessonIdx = (() => {
    const idx = lessons.findIndex((l) => l.id === lessonId);
    return idx >= 0 ? idx + 1 : 1;
  })();

  const tabs = ["Théorie", ...(quizData ? ["Quiz"] : []), "Pratique"];
  const isCompleted = completedIds.has(lessonId);
  const totalQuestions = quizData?.questions.length ?? 0;
  const scoreCount = quizScore !== null ? Math.round(quizScore * totalQuestions) : null;

  const currentLessonIdx = lessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentLessonIdx > 0 ? lessons[currentLessonIdx - 1] : null;
  const nextLesson = currentLessonIdx >= 0 && currentLessonIdx < lessons.length - 1 ? lessons[currentLessonIdx + 1] : null;

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-65px)] items-center justify-center bg-[#0a0a0f]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Chargement de la leçon...</p>
        </div>
      </div>
    );
  }

  if (error || !currentLesson || !course) {
    return (
      <div className="flex h-[calc(100vh-65px)] items-center justify-center bg-[#0a0a0f]">
        <div className="flex flex-col items-center gap-3">
          <p className="text-red-400 text-sm">{error ?? "Leçon introuvable"}</p>
          <button
            onClick={() => router.push("/student/catalogue")}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            ← Retour au catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-65px)] overflow-hidden">
      <LessonSidebar
        courseId={courseId}
        courseTitle={course.title}
        backHref="/student/catalogue"
        backLabel="← Retour au catalogue"
        lessons={sidebarLessons}
        activeLesson={activeLessonIdx}
        onLessonChange={handleLessonChange}
        accentColor="purple"
        showProgress
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 dark:border-gray-200 bg-[#0f0f1a] dark:bg-white shrink-0">
          <div>
            <h1 className="text-sm font-semibold text-white dark:text-gray-900">
              {currentLesson.title}
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{course.title}</p>
          </div>
          <button
            onClick={markComplete}
            disabled={isCompleted}
            className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${
              isCompleted
                ? "bg-green-600/20 text-green-400 cursor-default"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            {isCompleted ? "✓ Leçon complétée" : "Marquer comme lu"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 dark:border-gray-200 bg-white/5 dark:bg-gray-50 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? "border-purple-500 text-purple-400 dark:text-purple-600"
                  : "border-transparent text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "Théorie" && (
            <TheoryTab
              content={currentLesson.docs ?? "*Aucun contenu disponible pour cette leçon.*"}
              onProgressChange={handleTheoryProgress}
            />
          )}

          {activeTab === "Quiz" && quizData && (
            <div className="h-full overflow-y-auto px-6 py-6 max-w-2xl mx-auto w-full">
              {quizScore !== null ? (
                <div className="flex flex-col items-center gap-6 py-8">
                  <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold border-4 ${
                      quizScore >= 0.8
                        ? "border-green-500 text-green-400"
                        : quizScore >= 0.5
                        ? "border-yellow-500 text-yellow-400"
                        : "border-red-500 text-red-400"
                    }`}
                  >
                    {scoreCount}/{totalQuestions}
                  </div>
                  <div className="text-center">
                    <p className="text-white dark:text-gray-900 font-semibold text-lg">
                      {quizScore >= 0.8
                        ? "Parfait ! 🎉"
                        : quizScore >= 0.5
                        ? "Bien joué ! 👍"
                        : "À retravailler 💪"}
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                      {scoreCount} bonne{scoreCount !== 1 ? "s" : ""} réponse{scoreCount !== 1 ? "s" : ""} sur {totalQuestions}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedChoices({});
                      setQuizScore(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors"
                  >
                    🔄 Recommencer
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <p className="text-xs text-gray-500">
                    {totalQuestions} question{totalQuestions > 1 ? "s" : ""} · Sélectionnez une réponse par question
                  </p>
                  {quizData.questions
                    .slice()
                    .sort((a, b) => a.ordre - b.ordre)
                    .map((q, qi) => (
                      <div
                        key={q.id}
                        className="rounded-xl border border-white/10 dark:border-gray-200 bg-white/5 dark:bg-gray-50 p-4 flex flex-col gap-3"
                      >
                        <p className="text-sm font-medium text-white dark:text-gray-900">
                          <span className="text-gray-500 mr-2">Q{qi + 1}.</span>
                          {q.statement}
                        </p>
                        <div className="flex flex-col gap-2">
                          {q.choices.map((c, ci) => (
                            <button
                              key={c.id}
                              onClick={() =>
                                setSelectedChoices((prev) => ({ ...prev, [q.id]: c.id }))
                              }
                              className={`text-left text-sm px-4 py-2.5 rounded-xl border transition-colors ${
                                selectedChoices[q.id] === c.id
                                  ? "border-purple-500 bg-purple-500/20 text-purple-300 dark:text-purple-700"
                                  : "border-white/10 dark:border-gray-200 text-gray-400 dark:text-gray-600 hover:bg-white/5 dark:hover:bg-gray-100"
                              }`}
                            >
                              <span className="text-gray-500 mr-2">
                                {String.fromCharCode(65 + ci)}.
                              </span>
                              {c.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  <button
                    onClick={handleQuizSubmit}
                    disabled={
                      quizSubmitting ||
                      !quizData.questions.every((q) => selectedChoices[q.id])
                    }
                    className="self-end px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                  >
                    {quizSubmitting ? "Envoi..." : "Valider le quiz →"}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "Pratique" && (
            <PracticeTab initialCode={DEFAULT_CODE} language="javascript" />
          )}
        </div>

        {/* Bottom navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 dark:border-gray-200 bg-[#0f0f1a] dark:bg-white shrink-0">
          {prevLesson ? (
            <Link
              href={`/student/cours/${courseId}/${prevLesson.id}`}
              className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900 transition-colors"
            >
              ← {prevLesson.title}
            </Link>
          ) : (
            <div />
          )}
          {nextLesson ? (
            <Link
              href={`/student/cours/${courseId}/${nextLesson.id}`}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors"
            >
              {nextLesson.title} →
            </Link>
          ) : (
            <Link
              href="/student/catalogue"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors"
            >
              ✓ Terminer le cours
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
