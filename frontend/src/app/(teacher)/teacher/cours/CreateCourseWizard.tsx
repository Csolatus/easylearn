import { X, Globe, School, Lock, Check } from "lucide-react";

const VISIBILITY_LABEL: Record<string, string> = { public: "Public", school: "École", private: "Privé" };
const VISIBILITY_ICON: Record<string, React.ReactNode> = {
  public: <Globe size={18} />,
  school: <School size={18} />,
  private: <Lock size={18} />,
};

type Props = {
  step: number;
  title: string;
  visibility: "public" | "school" | "private";
  submitting: boolean;
  error: string | null;
  onTitleChange: (v: string) => void;
  onVisibilityChange: (v: "public" | "school" | "private") => void;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  onCreate: () => void;
};

export default function CreateCourseWizard({
  step, title, visibility, submitting, error,
  onTitleChange, onVisibilityChange, onNext, onBack, onClose, onCreate,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface rounded-2xl border border-white/10 dark:border-gray-300 shadow-2xl">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Nouveau cours</h2>
            <p className="text-xs text-muted mt-0.5">Étape {step} sur 2</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-foreground transition-colors text-lg">✕</button>
        </div>

        <div className="px-6 py-2 flex gap-2">
          {[1, 2].map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-green-500" : "bg-white/10 dark:bg-gray-200"}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="px-6 py-5 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted uppercase tracking-wider">Titre du cours</label>
              <input
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="ex: Introduction à React"
                autoFocus
                className="bg-white/5 dark:bg-gray-100 border border-white/10 dark:border-gray-300 text-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="px-6 py-5 flex flex-col gap-4">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Visibilité</p>
            <div className="flex flex-col gap-3">
              {(["private", "school", "public"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => onVisibilityChange(v)}
                  className={`flex items-center gap-3 py-3 px-4 rounded-xl border text-left transition-colors ${
                    visibility === v ? "border-green-500 bg-green-500/10 text-green-400" : "border-border text-gray-400 dark:text-gray-600 hover:border-green-500/50"
                  }`}
                >
                  <span>{VISIBILITY_ICON[v]}</span>
                  <div>
                    <p className="text-sm font-medium">{VISIBILITY_LABEL[v]}</p>
                    <p className="text-xs opacity-70">
                      {v === "public" ? "Visible par tous les étudiants" : v === "school" ? "Visible par l'école associée" : "Visible uniquement par vous"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            {error && <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}
          </div>
        )}

        <div className="px-6 py-4 border-t border-border flex justify-between">
          <button onClick={step === 1 ? onClose : onBack} className="text-sm text-gray-400 hover:text-foreground transition-colors flex items-center gap-1">
            {step === 1 ? (
              "Annuler"
            ) : (
              <>
                <ArrowLeft size={14} /> Retour
              </>
            )}
          </button>
          {step === 1 ? (
            <button onClick={onNext} disabled={!title.trim()} className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors flex items-center gap-1">
              Suivant <ArrowRight size={14} />
            </button>
          ) : (
            <button onClick={onCreate} disabled={submitting} className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors">
              {submitting ? "Création..." : <span className="flex items-center gap-2"><Check size={14} /> Créer le cours</span>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
