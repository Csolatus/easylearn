"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import LessonSidebar, { type Lesson } from "@/components/course/LessonSidebar";
import TheoryTab from "@/components/course/TheoryTab";
import PracticeTab from "@/components/course/PracticeTab";
import LessonHeader from "./LessonHeader";
import LessonTabs from "./LessonTabs";
import QuizTab from "./QuizTab";
import LessonBottomNav from "./LessonBottomNav";
import Spinner from "@/components/ui/Spinner";

const API = process.env.NEXT_PUBLIC_API_URL;

type BackendLesson = { id: string; course_id: string; title: string; docs: string | null; ordre: number; updated_at: string };
type BackendCourse = { id: string; title: string; visibility: string };
type BackendChoice = { id: string; text: string; is_correct?: boolean | null };
type BackendQuestion = { id: string; statement: string; ordre: number; choices: BackendChoice[] };
type BackendQuiz = { id: string; lesson_id: string; questions: BackendQuestion[] };
type LessonProgress = { lesson_id: string; completed: boolean };
type PracticalExercise = { id: string; instructions: string; expected_output: string };

const DEFAULT_CODE = `// Sandbox — écrivez votre code ici\nconsole.log("Hello, EasyLearn!");\n`;

export default function LessonPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  const [course, setCourse] = useState<BackendCourse | null>(null);
  const [lessons, setLessons] = useState<BackendLesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<BackendLesson | null>(null);
  const [quizData, setQuizData] = useState<BackendQuiz | null>(null);
  const [exercise, setExercise] = useState<PracticalExercise | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Théorie");
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizSubmitting, setQuizSubmitting] = useState(false);

  // Reset tab state immediately when the lesson changes so the stale "Quiz"
  // tab from the previous lesson is never shown during the loading phase.
  useEffect(() => {
    setActiveTab("Théorie");
    setSelectedChoices({});
    setQuizScore(null);
    setQuizData(null);
    setExercise(null);

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

        return Promise.all([
          fetch(`${API}/lessons/${lessonId}/quiz`, { headers }),
          fetch(`${API}/lessons/${lessonId}/exercise`, { headers }),
        ]);
      })
      .then(async ([quizRes, exerciseRes]) => {
        if (quizRes.ok) {
          const quiz: BackendQuiz = await quizRes.json();
          if (quiz.questions.length > 0) setQuizData(quiz);
        }
        if (exerciseRes.ok) {
          const ex: PracticalExercise = await exerciseRes.json();
          setExercise(ex);
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Une erreur est survenue"))
      .finally(() => setIsLoading(false));
  }, [courseId, lessonId, token]);

  const markComplete = async () => {
    if (completedIds.has(lessonId)) return;
    try {
      const res = await fetch(`${API}/lessons/${lessonId}/complete`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) setCompletedIds((prev) => new Set([...prev, lessonId]));
    } catch { /* silent */ }
  };

  const handleQuizSubmit = async () => {
    if (!quizData || quizSubmitting) return;
    if (!quizData.questions.every((q) => selectedChoices[q.id])) return;
    setQuizSubmitting(true);
    try {
      const answers = quizData.questions.map((q) => ({ question_id: q.id, choice_id: selectedChoices[q.id] }));
      const res = await fetch(`${API}/lessons/${lessonId}/quiz/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
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

  const tabs = ["Théorie", "Pratique", ...(quizData ? ["Quiz"] : [])];
  const currentLessonIdx = lessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentLessonIdx > 0 ? lessons[currentLessonIdx - 1] : null;
  const nextLesson = currentLessonIdx >= 0 && currentLessonIdx < lessons.length - 1 ? lessons[currentLessonIdx + 1] : null;

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-65px)] items-center justify-center bg-[#0a0a0f]">
        <div className="flex flex-col items-center gap-3">
          <Spinner color="border-purple-500" />
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
          <button onClick={() => router.push("/student/catalogue")} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
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
        onLessonChange={(numericId) => {
          const lesson = lessons[numericId - 1];
          if (lesson) router.push(`/student/cours/${courseId}/${lesson.id}`);
        }}
        accentColor="purple"
        showProgress
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <LessonHeader
          lessonTitle={currentLesson.title}
          courseTitle={course.title}
          isCompleted={completedIds.has(lessonId)}
          onMarkComplete={markComplete}
        />

        <LessonTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1 overflow-hidden">
          {activeTab === "Théorie" && (
            <TheoryTab
              content={currentLesson.docs ?? "*Aucun contenu disponible pour cette leçon.*"}
              onProgressChange={(progress) => { if (progress >= 90) markComplete(); }}
            />
          )}
          {activeTab === "Quiz" && quizData && (
            <QuizTab
              questions={quizData.questions}
              selectedChoices={selectedChoices}
              quizScore={quizScore}
              quizSubmitting={quizSubmitting}
              onChoiceSelect={(qId, cId) => setSelectedChoices((prev) => ({ ...prev, [qId]: cId }))}
              onSubmit={handleQuizSubmit}
              onRetry={() => { setSelectedChoices({}); setQuizScore(null); }}
            />
          )}
          {activeTab === "Pratique" && (
            <PracticeTab
              initialCode={DEFAULT_CODE}
              language={course.title.toLowerCase().includes("python") ? "python" : "javascript"}
              exerciseId={exercise?.id}
              instructions={exercise?.instructions}
            />
          )}
        </div>

        <LessonBottomNav courseId={courseId} prevLesson={prevLesson} nextLesson={nextLesson} />
      </div>
    </div>
  );
}
