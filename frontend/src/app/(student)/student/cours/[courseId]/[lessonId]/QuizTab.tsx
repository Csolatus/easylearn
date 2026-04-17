type Choice = { id: string; text: string };
type Question = { id: string; statement: string; ordre: number; choices: Choice[] };

type Props = {
  questions: Question[];
  selectedChoices: Record<string, string>;
  quizScore: number | null;
  quizSubmitting: boolean;
  onChoiceSelect: (questionId: string, choiceId: string) => void;
  onSubmit: () => void;
  onRetry: () => void;
};

export default function QuizTab({ questions, selectedChoices, quizScore, quizSubmitting, onChoiceSelect, onSubmit, onRetry }: Props) {
  const totalQuestions = questions.length;
  const scoreCount = quizScore !== null ? Math.round(quizScore * totalQuestions) : null;

  if (quizScore !== null) {
    return (
      <div className="h-full overflow-y-auto px-6 py-6 max-w-2xl mx-auto w-full">
        <div className="flex flex-col items-center gap-6 py-8">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold border-4 ${
            quizScore >= 0.8 ? "border-green-500 text-green-400"
            : quizScore >= 0.5 ? "border-yellow-500 text-yellow-400"
            : "border-red-500 text-red-400"
          }`}>
            {scoreCount}/{totalQuestions}
          </div>
          <div className="text-center">
            <p className="text-foreground font-semibold text-lg">
              {quizScore >= 0.8 ? "Parfait ! 🎉" : quizScore >= 0.5 ? "Bien joué ! 👍" : "À retravailler 💪"}
            </p>
            <p className="text-muted text-sm mt-1">
              {scoreCount} bonne{scoreCount !== 1 ? "s" : ""} réponse{scoreCount !== 1 ? "s" : ""} sur {totalQuestions}
            </p>
          </div>
          <button
            onClick={onRetry}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors"
          >
            🔄 Recommencer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-6 py-6 max-w-2xl mx-auto w-full">
      <div className="flex flex-col gap-5">
        <p className="text-xs text-gray-500">
          {totalQuestions} question{totalQuestions > 1 ? "s" : ""} · Sélectionnez une réponse par question
        </p>
        {questions
          .slice()
          .sort((a, b) => a.ordre - b.ordre)
          .map((q, qi) => (
            <div key={q.id} className="rounded-xl border border-border bg-white/5 p-4 flex flex-col gap-3">
              <p className="text-sm font-medium text-foreground">
                <span className="text-gray-500 mr-2">Q{qi + 1}.</span>
                {q.statement}
              </p>
              <div className="flex flex-col gap-2">
                {q.choices.map((c, ci) => (
                  <button
                    key={c.id}
                    onClick={() => onChoiceSelect(q.id, c.id)}
                    className={`text-left text-sm px-4 py-2.5 rounded-xl border transition-colors ${
                      selectedChoices[q.id] === c.id
                        ? "border-purple-500 bg-purple-500/20 text-purple-300 dark:text-purple-700"
                        : "border-border text-gray-400 dark:text-gray-600 hover:bg-surface"
                    }`}
                  >
                    <span className="text-gray-500 mr-2">{String.fromCharCode(65 + ci)}.</span>
                    {c.text}
                  </button>
                ))}
              </div>
            </div>
          ))}
        <button
          onClick={onSubmit}
          disabled={quizSubmitting || !questions.every((q) => selectedChoices[q.id])}
          className="self-end px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
        >
          {quizSubmitting ? "Envoi..." : "Valider le quiz →"}
        </button>
      </div>
    </div>
  );
}
