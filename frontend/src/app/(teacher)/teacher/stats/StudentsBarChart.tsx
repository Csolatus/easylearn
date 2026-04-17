type CourseAnalytics = { course_id: string; title: string; unique_students: number };

type Props = { courses: CourseAnalytics[] };

export default function StudentsBarChart({ courses }: Props) {
  const maxStudents = Math.max(1, ...courses.map((c) => c.unique_students));

  return (
    <div className="bg-surface rounded-2xl p-6">
      <h2 className="font-semibold text-foreground mb-6">Étudiants uniques par cours</h2>
      <div className="flex items-end gap-3 h-36">
        {courses.map((c) => (
          <div key={c.course_id} className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <span className="text-xs text-gray-400">{c.unique_students}</span>
            <div
              className="w-full bg-green-500 rounded-t-lg transition-all duration-300"
              style={{ height: `${Math.max(4, (c.unique_students / maxStudents) * 100)}%` }}
            />
            <span className="text-xs text-gray-500 truncate w-full text-center">{c.title.split(" ").slice(0, 2).join(" ")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
