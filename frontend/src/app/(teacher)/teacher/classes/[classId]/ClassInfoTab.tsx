type Classroom = { name: string; invite_code: string; is_archived: boolean; created_at: string };

type Props = { classroom: Classroom };

export default function ClassInfoTab({ classroom }: Props) {
  return (
    <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-4">
      <h2 className="font-semibold text-white dark:text-gray-900">Informations de la classe</h2>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center py-2 border-b border-white/5 dark:border-gray-100">
          <span className="text-xs text-gray-400 uppercase tracking-wider">Nom</span>
          <span className="text-sm text-white dark:text-gray-900 font-medium">{classroom.name}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-white/5 dark:border-gray-100">
          <span className="text-xs text-gray-400 uppercase tracking-wider">Code d&apos;invitation</span>
          <span className="font-mono text-green-400 text-sm font-bold">{classroom.invite_code}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-white/5 dark:border-gray-100">
          <span className="text-xs text-gray-400 uppercase tracking-wider">Statut</span>
          <span className={`text-sm font-medium ${classroom.is_archived ? "text-gray-400" : "text-green-400"}`}>
            {classroom.is_archived ? "Archivée" : "Active"}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-xs text-gray-400 uppercase tracking-wider">Créée le</span>
          <span className="text-sm text-white dark:text-gray-900">{new Date(classroom.created_at).toLocaleDateString("fr-FR")}</span>
        </div>
      </div>
    </div>
  );
}
