import Link from "next/link";
import { Check } from "lucide-react";

type Lesson = { id: string; title: string; ordre: number };

type Props = {
  courseId: string;
  lessons: Lesson[];
  completedIds: Set<string>;
};

export default function LessonList({ courseId, lessons, completedIds }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
        Leçons ({lessons.length})
      </h2>
      {lessons.length === 0 && (
        <p className="text-gray-500 text-sm py-4 text-center">Aucune leçon pour ce cours.</p>
      )}
      {lessons.map((lesson, idx) => {
        const done = completedIds.has(lesson.id);
        return (
          <Link
            key={lesson.id}
            href={`/student/cours/${courseId}/${lesson.id}`}
            className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-surface hover:bg-white/10 dark:hover:bg-gray-50 transition-colors"
          >
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              done ? "bg-green-500/20 text-green-400" : "bg-white/10 dark:bg-gray-200 text-gray-400"
            }`}>
              {done ? <Check size={12} /> : idx + 1}
            </span>
            <span className="text-sm text-foreground flex-1">{lesson.title}</span>
            <span className="text-gray-600 dark:text-gray-400 text-xs">→</span>
          </Link>
        );
      })}
    </div>
  );
}
