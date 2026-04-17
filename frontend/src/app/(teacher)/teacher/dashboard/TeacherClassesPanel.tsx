import Link from "next/link";
import Spinner from "@/components/ui/Spinner";

type Classroom = { id: string; name: string; invite_code: string; is_archived: boolean };

type Props = { classes: Classroom[]; isLoading: boolean };

export default function TeacherClassesPanel({ classes, isLoading }: Props) {
  const active = classes.filter((c) => !c.is_archived);

  return (
    <div className="bg-surface rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Mes classes</h2>
        <Link href="/teacher/classes" className="text-green-400 hover:text-green-300 text-xs">Gérer →</Link>
      </div>

      {isLoading && <div className="flex justify-center py-6"><Spinner color="border-green-500" /></div>}

      {!isLoading && active.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-6">
          <p className="text-gray-500 text-sm">Aucune classe active.</p>
          <Link href="/teacher/classes" className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors">
            Créer une classe →
          </Link>
        </div>
      )}

      {!isLoading && active.map((cls) => (
        <Link key={cls.id} href={`/teacher/classes/${cls.id}`}
          className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 dark:hover:bg-gray-100 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-green-600/20 flex items-center justify-center shrink-0">🏫</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{cls.name}</p>
            <p className="text-xs text-gray-500 font-mono mt-0.5">{cls.invite_code}</p>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">Active</span>
        </Link>
      ))}
    </div>
  );
}
