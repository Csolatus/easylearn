import Link from "next/link";

type Classroom = { name: string; invite_code: string; is_archived: boolean };

type Props = { classroom: Classroom; copied: boolean; onCopyCode: () => void };

export default function ClassDetailHeader({ classroom, copied, onCopyCode }: Props) {
  return (
    <div>
      <Link href="/teacher/classes" className="text-gray-400 hover:text-white dark:hover:text-gray-900 text-xs transition-colors mb-3 inline-block">
        ← Retour aux classes
      </Link>
      <h1 className="text-3xl font-bold text-white dark:text-gray-900">{classroom.name}</h1>
      <p className="text-gray-400 dark:text-gray-500 text-sm mt-1 flex items-center gap-3">
        <span className="font-mono text-green-400">{classroom.invite_code}</span>
        <button onClick={onCopyCode} className="text-xs text-gray-500 hover:text-white transition-colors">
          {copied ? "Copié !" : "Copier"}
        </button>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${classroom.is_archived ? "bg-gray-500/20 text-gray-400" : "bg-green-500/20 text-green-400"}`}>
          {classroom.is_archived ? "Archivée" : "Active"}
        </span>
      </p>
    </div>
  );
}
