import Link from "next/link";

type Props = {
  courseId: string;
  title: string;
  visibility: string;
  doneCount: number;
  totalCount: number;
  progress: number;
  resumeLessonId: string | null;
};

export default function CourseOverviewHeader({ courseId, title, visibility, doneCount, totalCount, progress, resumeLessonId }: Props) {
  const btnLabel = doneCount === 0 ? "Commencer →" : doneCount === totalCount ? "✓ Terminé" : "Continuer →";

  return (
    <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white dark:text-gray-900">{title}</h1>
          <span className={`mt-2 inline-block text-xs font-bold px-2 py-0.5 rounded-full ${
            visibility === "public" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
          }`}>
            {visibility}
          </span>
        </div>
        {resumeLessonId && (
          <Link
            href={`/student/cours/${courseId}/${resumeLessonId}`}
            className="shrink-0 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors"
          >
            {btnLabel}
          </Link>
        )}
      </div>

      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>Progression</span>
          <span>{doneCount}/{totalCount} leçons · {progress}%</span>
        </div>
        <div className="h-2 bg-white/10 dark:bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${progress === 100 ? "bg-green-500" : "bg-purple-500"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
