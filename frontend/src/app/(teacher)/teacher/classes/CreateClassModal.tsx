import { Modal } from "@/components/ui/Modal";

type School = { id: string; name: string };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  createdInviteCode: string | null;
  className: string;
  selectedSchoolId: string;
  formError: string | null;
  submitting: boolean;
  copied: boolean;
  schools: School[];
  onClassNameChange: (v: string) => void;
  onSchoolChange: (v: string) => void;
  onCreate: () => void;
  onCopyCode: () => void;
};

export default function CreateClassModal({
  isOpen, onClose, createdInviteCode, className, selectedSchoolId, formError,
  submitting, copied, schools, onClassNameChange, onSchoolChange, onCreate, onCopyCode,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={createdInviteCode ? "Classe créée !" : "Nouvelle classe"}
      size="sm"
      footer={
        createdInviteCode ? (
          <button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
            Fermer
          </button>
        ) : (
          <div className="flex gap-3 w-full">
            <button onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
              Annuler
            </button>
            <button onClick={onCreate} disabled={submitting} className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
              {submitting ? "Création..." : "Créer la classe"}
            </button>
          </div>
        )
      }
    >
      {createdInviteCode ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Partagez ce code d&apos;invitation à vos élèves pour qu&apos;ils rejoignent la classe.
          </p>
          <div className="flex items-center gap-2 bg-[#0f0f1a] dark:bg-gray-100 rounded-xl px-4 py-3">
            <span className="flex-1 font-mono text-green-400 dark:text-green-600 text-sm tracking-widest font-bold">{createdInviteCode}</span>
            <button onClick={onCopyCode} className="text-xs text-gray-400 hover:text-white dark:hover:text-gray-900 transition-colors px-2 py-1 rounded-lg hover:bg-white/10 dark:hover:bg-gray-200">
              {copied ? "Copié !" : "Copier"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400 dark:text-gray-600">
              Nom de la classe <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="ex: JS Avancé — Groupe A"
              value={className}
              onChange={(e) => onClassNameChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onCreate()}
              autoFocus
              className="bg-[#0f0f1a] dark:bg-gray-100 dark:text-gray-900 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          {schools.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-400 dark:text-gray-600">
                École associée <span className="text-gray-500">(optionnel)</span>
              </label>
              <select
                value={selectedSchoolId}
                onChange={(e) => onSchoolChange(e.target.value)}
                className="bg-[#0f0f1a] dark:bg-gray-100 dark:text-gray-900 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
              >
                <option value="">Classe personnelle</option>
                {schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}
          {formError && <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{formError}</p>}
        </div>
      )}
    </Modal>
  );
}
