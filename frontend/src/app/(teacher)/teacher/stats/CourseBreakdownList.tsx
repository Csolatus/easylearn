import { Users, Library } from "lucide-react";

type CourseAnalytics = { course_id: string; title: string; total_lessons: number; completed_lessons: number; unique_students: number; avg_quiz_score_pct: number };

type Props = { courses: CourseAnalytics[] };

export default function CourseBreakdownList({ courses }: Props) {
  return (
    <div className="bg-surface rounded-2xl p-6 flex flex-col gap-5">
      <h2 className="font-semibold text-foreground">Détail par cours</h2>
      {courses.length === 0 && <p className="text-gray-500 text-sm text-center py-8">Aucun cours créé.</p>}
      <div className="flex flex-col gap-3">
        {courses.map((course) => {
          const completion = course.total_lessons > 0 ? Math.round((course.completed_lessons / course.total_lessons) * 100) : 0;
          return (
            <div key={course.course_id} className="p-4 rounded-xl bg-white/5 flex flex-col gap-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="font-medium text-foreground text-sm">{course.title}</p>
                <div className="flex gap-4 text-xs text-muted">
                  <span>👥 {course.unique_students} étudiant{course.unique_students > 1 ? "s" : ""}</span>
                  <span>📚 {course.total_lessons} leçon{course.total_lessons > 1 ? "s" : ""}</span>
                  <span className={`font-medium ${course.avg_quiz_score_pct >= 70 ? "text-green-400" : course.avg_quiz_score_pct >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                    ⌀ quiz {Math.round(course.avg_quiz_score_pct)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-20">Complétion</span>
                <div className="flex-1 h-1.5 bg-white/10 dark:bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${completion}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-8 text-right">{completion}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
