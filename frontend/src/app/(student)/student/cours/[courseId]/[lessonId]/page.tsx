"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const MOCK_LESSONS = [
  { id: 1, title: "Introduction & Setup", type: "theory", done: true },
  { id: 2, title: "Variables & Types", type: "theory", done: true },
  { id: 3, title: "Fonctions avancées", type: "theory", done: false },
  { id: 4, title: "Quiz — Les bases", type: "quiz", done: false },
  { id: 5, title: "Exercice pratique", type: "code", done: false },
];

const TYPE_ICONS: Record<string, string> = {
  theory: "📝",
  quiz: "🧠",
  code: "💻",
};

const TYPE_LABELS: Record<string, string> = {
  theory: "Théorie",
  quiz: "Quiz",
  code: "Pratique",
};

export default function LessonDetailPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();

  const currentIndex = MOCK_LESSONS.findIndex((l) => l.id === Number(lessonId));
  const lesson = MOCK_LESSONS[currentIndex];
  const prevLesson = MOCK_LESSONS[currentIndex - 1] ?? null;
  const nextLesson = MOCK_LESSONS[currentIndex + 1] ?? null;
  const progress = Math.round(((currentIndex + 1) / MOCK_LESSONS.length) * 100);

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-65px)] gap-4">
        <p className="text-gray-400 text-sm">Leçon introuvable.</p>
        <Link href={`/student/cours/${courseId}`} className="text-purple-400 text-sm hover:underline">
          ← Retour au cours
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] overflow-hidden">
      {/* Progress bar */}
      <div className="h-1 bg-white/5 dark:bg-gray-200 shrink-0">
        <div
          className="h-full bg-purple-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 dark:border-gray-200 bg-[#0f0f1a] dark:bg-white shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href={`/student/cours/${courseId}`}
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900 transition-colors"
          >
            ← Retour au cours
          </Link>
          <span className="text-gray-600 dark:text-gray-300 text-xs">·</span>
          <span className="text-xs text-gray-500">
            {currentIndex + 1} / {MOCK_LESSONS.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-medium">
            {TYPE_ICONS[lesson.type]} {TYPE_LABELS[lesson.type]}
          </span>
        </div>
      </div>

      {/* Lesson title */}
      <div className="px-8 pt-6 pb-2 shrink-0 max-w-3xl mx-auto w-full">
        <h1 className="text-xl font-bold text-white dark:text-gray-900">{lesson.title}</h1>
      </div>

      {/* Content placeholder */}
      <div className="flex-1 overflow-hidden flex items-center justify-center">
        <p className="text-gray-500 text-sm">Contenu de la leçon — étape suivante</p>
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
            href={`/student/cours/${courseId}`}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors"
          >
            ✓ Terminer le cours
          </Link>
        )}
      </div>
    </div>
  );
}
