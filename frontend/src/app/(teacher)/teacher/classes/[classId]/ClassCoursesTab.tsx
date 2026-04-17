import Link from "next/link";

type Course = { id: string; title: string; visibility: string };

type Props = {
  courses: Course[];
  assignedIds: Set<string>;
  toggling: string | null;
  onToggle: (courseId: string) => void;
};

export default function ClassCoursesTab({ courses, assignedIds, toggling, onToggle }: Props) {
  return (
    <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-white dark:text-gray-900">Mes cours</h2>
        <span className="text-xs text-gray-400">{assignedIds.size} assigné{assignedIds.size > 1 ? "s" : ""}</span>
      </div>
      <p className="text-xs text-gray-500">Cochez les cours à rendre accessibles à cette classe.</p>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-6">
          <p className="text-gray-500 text-sm">Aucun cours créé.</p>
          <Link href="/teacher/cours" className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors">
            Créer un cours →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {courses.map((course) => {
            const isAssigned = assignedIds.has(course.id);
            return (
              <div key={course.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 dark:bg-gray-50">
                <span className="text-sm text-white dark:text-gray-900 flex-1 truncate">{course.title}</span>
                <span className="text-xs text-gray-500 capitalize">{course.visibility}</span>
                <button
                  onClick={() => onToggle(course.id)}
                  disabled={toggling === course.id}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
                    isAssigned ? "bg-green-500/20 text-green-400 hover:bg-red-500/20 hover:text-red-400" : "bg-white/5 text-gray-400 hover:bg-green-500/20 hover:text-green-400"
                  }`}
                >
                  {toggling === course.id ? "…" : isAssigned ? "Assigné" : "Assigner"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
