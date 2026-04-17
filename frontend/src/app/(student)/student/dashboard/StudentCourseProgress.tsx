import Link from "next/link";
import Spinner from "@/components/ui/Spinner";

type EnrolledCourse = {
  id: string;
  title: string;
  completed_lessons: number;
  total_lessons: number;
  percentage: number;
};

type Props = { courses: EnrolledCourse[]; isLoading: boolean };

export default function StudentCourseProgress({ courses, isLoading }: Props) {
  return (
    <div className="lg:col-span-2 bg-surface rounded-2xl p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Mes cours</h2>
        <Link href="/student/catalogue" className="text-purple-400 hover:text-purple-300 text-xs">Explorer →</Link>
      </div>

      {isLoading && <div className="flex justify-center py-6"><Spinner /></div>}

      {!isLoading && courses.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-6">
          <p className="text-gray-500 text-sm">Vous n&apos;avez pas encore commencé de cours.</p>
          <Link href="/student/catalogue" className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors">
            Découvrir les cours →
          </Link>
        </div>
      )}

      {!isLoading && courses.map((course) => (
        <Link key={course.id} href={`/student/cours/${course.id}`} className="flex flex-col gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 dark:hover:bg-gray-100 transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">{course.title}</p>
            {course.percentage === 100
              ? <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Terminé</span>
              : <span className="text-xs text-gray-400">{Math.round(course.percentage)}%</span>
            }
          </div>
          <div className="h-1.5 bg-white/10 dark:bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${course.percentage === 100 ? "bg-green-500" : "bg-purple-500"}`} style={{ width: `${course.percentage}%` }} />
          </div>
          <p className="text-xs text-gray-400">{course.completed_lessons}/{course.total_lessons} leçons complétées</p>
        </Link>
      ))}
    </div>
  );
}
