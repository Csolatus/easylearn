import Link from "next/link";
import Spinner from "@/components/ui/Spinner";

type EnrolledCourse = { id: string; title: string; completed_lessons: number; total_lessons: number; percentage: number };

type Props = { courses: EnrolledCourse[]; isLoading: boolean };

export default function ProfileCourseList({ courses, isLoading }: Props) {
  const inProgress = courses.filter((c) => c.percentage < 100);

  return (
    <div className="rounded-2xl border border-white/5 dark:border-gray-200 bg-[#111118] dark:bg-white overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5 dark:border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white dark:text-gray-900">Cours en cours</h2>
        <Link href="/student/catalogue" className="text-xs text-purple-400 hover:text-purple-300">Explorer →</Link>
      </div>

      {isLoading && <div className="flex justify-center py-8"><Spinner /></div>}

      {!isLoading && inProgress.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-8">
          <p className="text-sm text-gray-500">Aucun cours en cours.</p>
          <Link href="/student/catalogue" className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors">
            Découvrir les cours →
          </Link>
        </div>
      )}

      <div className="divide-y divide-white/5 dark:divide-gray-100">
        {!isLoading && inProgress.map((course) => (
          <Link key={course.id} href={`/student/cours/${course.id}`} className="px-6 py-4 flex items-center gap-4 hover:bg-white/5 dark:hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center text-lg shrink-0">📖</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white dark:text-gray-900 truncate">{course.title}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{course.completed_lessons}/{course.total_lessons} leçons</p>
              <div className="mt-2 h-1.5 w-full bg-white/10 dark:bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${course.percentage}%` }} />
              </div>
            </div>
            <span className="text-xs font-semibold text-purple-400 dark:text-purple-600 shrink-0">{Math.round(course.percentage)}%</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
