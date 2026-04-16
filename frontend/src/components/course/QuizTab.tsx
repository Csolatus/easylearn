"use client";

import { useState } from "react";

export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  answer: number;
};

type Props = {
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
};

export default function QuizTab({ questions, onComplete }: Props) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = submitted
    ? questions.filter((q) => selectedAnswers[q.id] === q.answer).length
    : 0;

  const allAnswered = Object.keys(selectedAnswers).length === questions.length;

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSubmitted(true);
    onComplete?.(score, questions.length);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="h-full overflow-y-auto px-6 py-6 max-w-2xl mx-auto w-full">
        <div className="flex flex-col items-center gap-6 py-8">
          {/* Score circle */}
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold border-4 ${
              score === questions.length
                ? "border-green-500 text-green-400"
                : score >= questions.length / 2
                ? "border-yellow-500 text-yellow-400"
                : "border-red-500 text-red-400"
            }`}
          >
            {score}/{questions.length}
          </div>

          <div className="text-center">
            <p className="text-white dark:text-gray-900 font-semibold text-lg">
              {score === questions.length
                ? "Parfait ! 🎉"
                : score >= questions.length / 2
                ? "Bien joué ! 👍"
                : "À retravailler 💪"}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              {score} bonne{score > 1 ? "s" : ""} réponse{score > 1 ? "s" : ""} sur{" "}
              {questions.length}
            </p>
          </div>

          {/* Review */}
          <div className="w-full flex flex-col gap-4">
            {questions.map((q) => {
              const chosen = selectedAnswers[q.id];
              const isCorrect = chosen === q.answer;
              return (
                <div
                  key={q.id}
                  className={`rounded-xl border p-4 ${
                    isCorrect
                      ? "border-green-500/30 bg-green-500/5"
                      : "border-red-500/30 bg-red-500/5"
                  }`}
                >
                  <p className="text-sm font-medium text-white dark:text-gray-900 mb-3">
                    {q.question}
                  </p>
                  <div className="flex flex-col gap-2">
                    {q.options.map((opt, oi) => (
                      <div
                        key={oi}
                        className={`text-xs px-3 py-2 rounded-lg flex items-center gap-2 ${
                          oi === q.answer
                            ? "bg-green-500/20 text-green-400"
                            : oi === chosen && !isCorrect
                            ? "bg-red-500/20 text-red-400"
                            : "text-gray-500"
                        }`}
                      >
                        <span>
                          {oi === q.answer ? "✓" : oi === chosen && !isCorrect ? "✗" : "·"}
                        </span>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleReset}
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
          {questions.length} question{questions.length > 1 ? "s" : ""} · Sélectionnez une réponse
          par question
        </p>

        {questions.map((q, qi) => (
          <div
            key={q.id}
            className="rounded-xl border border-white/10 dark:border-gray-200 bg-white/5 dark:bg-gray-50 p-4 flex flex-col gap-3"
          >
            <p className="text-sm font-medium text-white dark:text-gray-900">
              <span className="text-gray-500 mr-2">Q{qi + 1}.</span>
              {q.question}
            </p>
            <div className="flex flex-col gap-2">
              {q.options.map((opt, oi) => (
                <button
                  key={oi}
                  onClick={() =>
                    setSelectedAnswers((prev) => ({ ...prev, [q.id]: oi }))
                  }
                  className={`text-left text-sm px-4 py-2.5 rounded-xl border transition-colors ${
                    selectedAnswers[q.id] === oi
                      ? "border-purple-500 bg-purple-500/20 text-purple-300 dark:text-purple-700"
                      : "border-white/10 dark:border-gray-200 text-gray-400 dark:text-gray-600 hover:bg-white/5 dark:hover:bg-gray-100"
                  }`}
                >
                  <span className="text-gray-500 mr-2">{String.fromCharCode(65 + oi)}.</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="self-end px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
        >
          Valider le quiz →
        </button>
      </div>
    </div>
  );
}
