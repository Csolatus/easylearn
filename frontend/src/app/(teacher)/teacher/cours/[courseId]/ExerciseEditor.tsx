"use client";

import { Trash2 } from "lucide-react";

type Props = {
  instructions: string;
  expectedOutput: string;
  language: string;
  hasExercise: boolean;
  saving: boolean;
  saved: boolean;
  onInstructionsChange: (v: string) => void;
  onExpectedOutputChange: (v: string) => void;
  onLanguageChange: (v: string) => void;
  onSave: () => void;
  onDelete: () => void;
};

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
];

export default function ExerciseEditor({
  instructions,
  expectedOutput,
  language,
  hasExercise,
  saving,
  saved,
  onInstructionsChange,
  onExpectedOutputChange,
  onLanguageChange,
  onSave,
  onDelete,
}: Props) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 max-w-2xl mx-auto w-full flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider">
          Langage
        </label>
        <div className="flex gap-2">
          {LANGUAGES.map((l) => (
            <button
              key={l.value}
              onClick={() => onLanguageChange(l.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                language === l.value
                  ? "border-green-500 bg-green-500/10 text-green-400"
                  : "border-border text-muted hover:border-green-500/50"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider">
          Consigne
        </label>
        <textarea
          value={instructions}
          onChange={(e) => onInstructionsChange(e.target.value)}
          placeholder="Décrivez ce que l'étudiant doit faire...&#10;&#10;Ex : Écrivez une fonction qui prend un nombre en paramètre et retourne son double."
          rows={6}
          className="bg-white/5 dark:bg-gray-100 border border-white/10 dark:border-gray-300 text-foreground rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider">
          Sortie attendue
        </label>
        <p className="text-xs text-muted -mt-1">
          Ce que le programme doit afficher exactement (comparaison stricte).
        </p>
        <textarea
          value={expectedOutput}
          onChange={(e) => onExpectedOutputChange(e.target.value)}
          placeholder="Ex : 10"
          rows={3}
          className="bg-white/5 dark:bg-gray-100 border border-white/10 dark:border-gray-300 text-foreground rounded-xl px-4 py-3 text-sm font-mono placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        {hasExercise ? (
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 size={13} /> Supprimer l&apos;exercice
          </button>
        ) : (
          <span />
        )}
        <button
          onClick={onSave}
          disabled={saving || !instructions.trim() || !expectedOutput.trim()}
          className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
        >
          {saving ? "Sauvegarde..." : saved ? "Sauvegardé ✓" : hasExercise ? "Mettre à jour" : "Créer l'exercice"}
        </button>
      </div>
    </div>
  );
}
