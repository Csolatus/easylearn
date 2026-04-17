type CourseAnalytics = { course_id: string; title: string; total_lessons: number; completed_lessons: number };

type Props = { courses: CourseAnalytics[] };

export default function CourseCompletionChart({ courses }: Props) {
  return (
    <div className="bg-surface rounded-2xl p-6">
      <h2 className="font-semibold text-foreground mb-6">Complétion par cours</h2>
      <div className="flex items-end gap-3 h-32">
        {courses.map((course) => {
          const pct = course.total_lessons > 0 ? Math.round((course.completed_lessons / course.total_lessons) * 100) : 0;
          return (
            <div key={course.course_id} className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
              <span className="text-xs text-gray-400">{pct}%</span>
              <div className="w-full bg-white/10 dark:bg-gray-200 rounded-t-lg overflow-hidden" style={{ height: "80px" }}>
                <div className="w-full bg-green-500 rounded-t-lg transition-all duration-500" style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }} />
              </div>
              <span className="text-xs text-gray-500 truncate w-full text-center">{course.title.split(" ").slice(0, 2).join(" ")}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
