import Link from "next/link";

type School = { id: string; name: string };
type Classroom = { id: string; name: string; school_id: string | null; invite_code: string; is_archived: boolean; created_at: string };

type Props = { classroom: Classroom; schools: School[] };

export default function ClassCard({ classroom, schools }: Props) {
  return (
    <Link
      href={`/teacher/classes/${classroom.id}`}
      className="bg-surface rounded-2xl p-6 hover:ring-2 hover:ring-green-500/50 transition-all flex flex-col gap-4"
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-600/20 flex items-center justify-center text-lg">🏫</div>
          <div>
            <p className="font-semibold text-foreground">{classroom.name}</p>
            <p className="text-xs text-muted mt-0.5 font-mono">Code : {classroom.invite_code}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {classroom.school_id && (
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-500/20 text-blue-400">
              {schools.find((s) => s.id === classroom.school_id)?.name ?? "École"}
            </span>
          )}
          {!classroom.school_id && (
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-purple-500/20 text-purple-400">Personnelle</span>
          )}
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${!classroom.is_archived ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
            {classroom.is_archived ? "Archivée" : "Active"}
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Créée le {new Date(classroom.created_at).toLocaleDateString("fr-FR")}
      </p>
    </Link>
  );
}
