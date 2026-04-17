type EditorTab = "Théorie" | "Quiz";

type Props = {
  lessonTitle: string | null;
  activeTab: EditorTab;
  saving: boolean;
  saved: boolean;
  savingQuiz: boolean;
  quizSaved: boolean;
  onSaveTheory: () => void;
  onSaveQuiz: () => void;
};

export default function LessonEditorHeader({ lessonTitle, activeTab, saving, saved, savingQuiz, quizSaved, onSaveTheory, onSaveQuiz }: Props) {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-background dark:bg-white shrink-0">
      <div>
        <h1 className="text-sm font-semibold text-foreground">{lessonTitle ?? "Sélectionnez une leçon"}</h1>
        <p className="text-xs text-muted mt-0.5">Édition en cours</p>
      </div>
      {lessonTitle && (
        activeTab === "Théorie" ? (
          <button onClick={onSaveTheory} disabled={saving}
            className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${saved ? "bg-emerald-600 text-white" : "bg-green-600 hover:bg-green-700 text-white"} disabled:opacity-50`}>
            {saving ? "Sauvegarde..." : saved ? "✓ Sauvegardé" : "Sauvegarder"}
          </button>
        ) : (
          <button onClick={onSaveQuiz} disabled={savingQuiz}
            className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${quizSaved ? "bg-emerald-600 text-white" : "bg-green-600 hover:bg-green-700 text-white"} disabled:opacity-50`}>
            {savingQuiz ? "Sauvegarde..." : quizSaved ? "✓ Sauvegardé" : "Sauvegarder le quiz"}
          </button>
        )
      )}
    </div>
  );
}
