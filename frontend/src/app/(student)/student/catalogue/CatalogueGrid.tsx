import Link from "next/link";
import { Library } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";

type Course = { id: string; title: string; visibility: string; created_at: string };

type Props = { courses: Course[]; isLoading: boolean; error: string | null };

export default function CatalogueGrid({ courses, isLoading, error }: Props) {
  if (isLoading) return <div className="flex items-center justify-center py-20"><Spinner color="border-purple-500" /></div>;
  if (error) return (
    <div className="flex flex-col items-center gap-3 py-20">
      <p className="text-red-400 text-sm">{error}</p>
      <button onClick={() => window.location.reload()} className="text-xs text-purple-400 hover:text-purple-300">Réessayer</button>
    </div>
  );
  if (courses.length === 0) return <EmptyState message="Aucun cours trouvé." />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Link key={course.id} href={`/student/cours/${course.id}`} className="bg-[#1a1a2e] dark:bg-white rounded-2xl overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all flex flex-col">
          <div className="h-36 bg-gradient-to-br from-purple-900 to-blue-900 dark:from-purple-200 dark:to-blue-200 flex items-center justify-center text-white/40 dark:text-white/60">
            <Library size={40} />
          </div>
          <div className="p-4 flex flex-col gap-2 flex-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full w-fit ${
              course.visibility === "public" ? "bg-green-500/20 text-green-400"
              : course.visibility === "school" ? "bg-blue-500/20 text-blue-400"
              : "bg-gray-500/20 text-gray-400"
            }`}>
              {course.visibility}
            </span>
            <h3 className="font-semibold text-white dark:text-gray-900 text-sm leading-snug">{course.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-auto">
              Ajouté le {new Date(course.created_at).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
