"use client";

import Link from "next/link";
import ProgressBar from "./ProgressBar";

export type Lesson = {
  id: number;
  title: string;
  type: "theory" | "quiz" | "code";
  done: boolean;
};

type Props = {
  courseId: string;
  courseTitle: string;
  courseSubtitle?: string;
  backHref: string;
  backLabel?: string;
  lessons: Lesson[];
  activeLesson: number;
  onLessonChange: (id: number) => void;
  accentColor?: "purple" | "green";
  showProgress?: boolean;
};

const TYPE_STYLES: Record<Lesson["type"], string> = {
  theory: "bg-blue-500/20 text-blue-400",
  quiz: "bg-yellow-500/20 text-yellow-400",
  code: "bg-green-500/20 text-green-400",
};

const TYPE_ICONS: Record<Lesson["type"], string> = {
  theory: "📝",
  quiz: "🧠",
  code: "💻",
};

const ACCENT_ACTIVE: Record<NonNullable<Props["accentColor"]>, string> = {
  purple: "bg-purple-600/20 text-purple-400",
  green: "bg-green-600/20 text-green-400",
};

export default function LessonSidebar({
  courseId,
  courseTitle,
  courseSubtitle,
  backHref,
  backLabel = "← Retour",
  lessons,
  activeLesson,
  onLessonChange,
  accentColor = "purple",
  showProgress = true,
}: Props) {
  const doneCount = lessons.filter((l) => l.done).length;
  const progressValue = lessons.length > 0 ? (doneCount / lessons.length) * 100 : 0;

  return (
    <aside className="w-64 shrink-0 border-r border-white/10 dark:border-gray-200 bg-[#0d0d1a] dark:bg-gray-50 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-4 border-b border-white/10 dark:border-gray-200">
        <Link
          href={backHref}
          className="text-xs text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900 transition-colors"
        >
          {backLabel}
        </Link>
        <p className="text-xs font-semibold text-white dark:text-gray-900 mt-2">
          Cours #{courseId}
        </p>
        {courseSubtitle && (
          <p className="text-xs text-gray-500 mt-0.5">{courseSubtitle}</p>
        )}
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5 font-medium">{courseTitle}</p>

        {showProgress && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>Progression</span>
              <span>
                {doneCount}/{lessons.length} leçons
              </span>
            </div>
            <ProgressBar value={progressValue} color={accentColor} />
          </div>
        )}
      </div>

      {/* Lesson list */}
      <div className="px-3 py-3 flex-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
          Leçons
        </p>
        {lessons.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => onLessonChange(lesson.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors mb-1 ${
              activeLesson === lesson.id
                ? ACCENT_ACTIVE[accentColor]
                : "text-gray-400 dark:text-gray-500 hover:bg-white/5 dark:hover:bg-gray-100"
            }`}
          >
            <span
              className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${TYPE_STYLES[lesson.type]}`}
            >
              {TYPE_ICONS[lesson.type]}
            </span>
            <span className="text-xs truncate">{lesson.title}</span>
            {lesson.done && (
              <span className="ml-auto text-green-500 text-xs shrink-0">✓</span>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}
