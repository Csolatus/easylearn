import Link from "next/link";

type Lesson = { id: string; title: string };

type Props = {
  courseId: string;
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
};

export default function LessonBottomNav({ courseId, prevLesson, nextLesson }: Props) {
  return (
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
  );
}
