import Spinner from "@/components/ui/Spinner";

type LocalChoice = { text: string; isCorrect: boolean };
type LocalQuestion = { id?: string; statement: string; choices: LocalChoice[] };

type Props = {
  questions: LocalQuestion[];
  loading: boolean;
  onAddQuestion: () => void;
  onUpdateQuestion: (i: number, value: string) => void;
  onUpdateChoice: (qi: number, ci: number, value: string) => void;
  onSetCorrect: (qi: number, ci: number) => void;
  onRemoveQuestion: (i: number) => void;
};

export default function QuizBuilder({ questions, loading, onAddQuestion, onUpdateQuestion, onUpdateChoice, onSetCorrect, onRemoveQuestion }: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
      {loading && <div className="flex justify-center py-8"><Spinner color="border-green-500" /></div>}

      {!loading && questions.map((q, qi) => (
        <div key={qi} className="flex flex-col gap-3 rounded-xl border border-border bg-white/5 p-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 shrink-0">Q{qi + 1}</span>
            <input
              value={q.statement}
              onChange={(e) => onUpdateQuestion(qi, e.target.value)}
              placeholder="Écrivez votre question..."
              className="flex-1 bg-white/5 border border-border text-foreground rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
            />
            <button onClick={() => onRemoveQuestion(qi)} className="text-gray-500 hover:text-red-400 text-sm transition-colors shrink-0" aria-label="Supprimer la question">✕</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {q.choices.map((choice, ci) => (
              <div key={ci} className="flex items-center gap-2">
                <button
                  onClick={() => onSetCorrect(qi, ci)}
                  aria-label={`Sélectionner l'option ${ci + 1} comme bonne réponse`}
                  className={`w-5 h-5 rounded-full border-2 shrink-0 transition-colors ${choice.isCorrect ? "border-green-500 bg-green-500" : "border-white/20 dark:border-gray-400"}`}
                />
                <input
                  value={choice.text}
                  onChange={(e) => onUpdateChoice(qi, ci, e.target.value)}
                  placeholder={`Option ${ci + 1}`}
                  className="flex-1 bg-white/5 border border-border text-foreground rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {!loading && (
        <button onClick={onAddQuestion} className="self-start text-xs text-green-400 hover:text-green-300 font-medium transition-colors">
          + Ajouter une question
        </button>
      )}
    </div>
  );
}
