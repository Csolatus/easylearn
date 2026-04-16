import Link from "next/link";

type Course = { id: string; title: string; visibility: string; updated_at: string };

const VISIBILITY_BADGE: Record<string, string> = {
  public:  "bg-green-500/10 text-green-400 dark:text-green-600",
  school:  "bg-blue-500/10 text-blue-400 dark:text-blue-600",
  private: "bg-gray-500/10 text-gray-400 dark:text-gray-500",
};

const VISIBILITY_LABEL: Record<string, string> = { public: "Public", school: "École", private: "Privé" };

type Props = { course: Course };

export default function CourseCardTeacher({ course }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 dark:border-gray-200 bg-[#111118] dark:bg-white shadow-md overflow-hidden flex flex-col group">
      <div className="relative h-32 bg-gradient-to-br from-green-900/60 to-teal-900/60 flex items-center justify-center">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <span className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-medium ${VISIBILITY_BADGE[course.visibility]}`}>
          {VISIBILITY_LABEL[course.visibility]}
        </span>
        <span className="text-4xl">📖</span>
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-bold text-white dark:text-gray-900 text-base leading-snug">{course.title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-auto">Mis à jour le {new Date(course.updated_at).toLocaleDateString("fr-FR")}</p>
        <div className="flex gap-2 pt-1">
          <Link href={`/teacher/cours/${course.id}`} className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors">
            ✏️ Modifier
          </Link>
        </div>
      </div>
    </div>
  );
}
