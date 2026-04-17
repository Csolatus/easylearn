import Link from "next/link";
import Spinner from "@/components/ui/Spinner";

type CourseAnalytics = {
  course_id: string;
  title: string;
  total_lessons: number;
  completed_lessons: number;
  unique_students: number;
  avg_quiz_score_pct: number;
};

type Props = { courses: CourseAnalytics[] | null; isLoading: boolean };

export default function TeacherCoursesPanel({ courses, isLoading }: Props) {
  return (
    <div className="bg-surface rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Mes cours</h2>
        <Link href="/teacher/cours" className="text-green-400 hover:text-green-300 text-xs">Voir tout →</Link>
      </div>

      {isLoading && <div className="flex justify-center py-6"><Spinner color="border-green-500" /></div>}

      {!isLoading && (!courses || courses.length === 0) && (
        <div className="flex flex-col items-center gap-3 py-6">
          <p className="text-gray-500 text-sm">Aucun cours créé.</p>
          <Link href="/teacher/cours" className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors">
            Créer un cours →
          </Link>
        </div>
      )}

      {!isLoading && courses?.map((course) => {
        const pct = course.total_lessons > 0 ? Math.round((course.completed_lessons / course.total_lessons) * 100) : 0;
        return (
          <Link key={course.course_id} href={`/teacher/cours/${course.course_id}`}
            className="flex flex-col gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 dark:hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">{course.title}</p>
              <span className="text-xs text-gray-400">👥 {course.unique_students}</span>
            </div>
            <div className="h-1.5 bg-white/10 dark:bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{course.completed_lessons}/{course.total_lessons} leçons complétées</span>
              <span className="text-green-400">⌀ quiz {Math.round(course.avg_quiz_score_pct)}%</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
