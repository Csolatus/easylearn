"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import TheoryTab from "@/components/course/TheoryTab";
import CodeEditor from "@/components/editor/CodeEditor";

const MOCK_LESSONS = [
  { id: 1, title: "Introduction & Setup", type: "theory", done: true },
  { id: 2, title: "Variables & Types", type: "theory", done: true },
  { id: 3, title: "Fonctions avancées", type: "theory", done: false },
  { id: 4, title: "Quiz — Les bases", type: "quiz", done: false },
  { id: 5, title: "Exercice pratique", type: "code", done: false },
];

const TYPE_ICONS: Record<string, string> = {
  theory: "📝",
  quiz: "🧠",
  code: "💻",
};

const TYPE_LABELS: Record<string, string> = {
  theory: "Théorie",
  quiz: "Quiz",
  code: "Pratique",
};

const THEORY_CONTENT = `# Fonctions avancées en JavaScript

## Introduction
Les fonctions sont au cœur de JavaScript. Dans cette leçon, nous allons explorer les **closures**, les **fonctions fléchées** et les **higher-order functions**.

## Closures
Une closure est une fonction qui capture les variables de son environnement lexical.

\`\`\`js
function counter() {
  let count = 0;
  return () => ++count;
}
const inc = counter();
console.log(inc()); // 1
console.log(inc()); // 2
\`\`\`

## Fonctions fléchées
Les fonctions fléchées ont une syntaxe concise et ne redéfinissent pas \`this\`.

\`\`\`js
const double = (n) => n * 2;
\`\`\`

## Higher-Order Functions
\`\`\`js
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
\`\`\`
`;

const MOCK_QUIZ = [
  {
    id: 1,
    question: "Qu'est-ce qu'une closure en JavaScript ?",
    options: [
      "Une fonction simple sans paramètre",
      "Une fonction qui capture les variables de son environnement lexical",
      "Un objet JavaScript",
      "Une classe ES6",
    ],
    answer: 1,
  },
  {
    id: 2,
    question: "Quelle méthode transforme chaque élément d'un tableau ?",
    options: ["filter()", "reduce()", "map()", "forEach()"],
    answer: 2,
  },
  {
    id: 3,
    question: "Les fonctions fléchées redéfinissent-elles `this` ?",
    options: ["Oui, toujours", "Non, jamais", "Seulement en mode strict", "Ça dépend"],
    answer: 1,
  },
];

const CODE_STARTER = `// Exercice : Créez une fonction de mémoïsation
function memoize(fn) {
  // Votre code ici...
}

const slowSquare = (n) => {
  console.log("Calculating...");
  return n * n;
};

const fastSquare = memoize(slowSquare);
console.log(fastSquare(4)); // 16
console.log(fastSquare(4)); // 16 (from cache)
`;

export default function LessonDetailPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [codeContent, setCodeContent] = useState(CODE_STARTER);

  const currentIndex = MOCK_LESSONS.findIndex((l) => l.id === Number(lessonId));
  const lesson = MOCK_LESSONS[currentIndex];
  const prevLesson = MOCK_LESSONS[currentIndex - 1] ?? null;
  const nextLesson = MOCK_LESSONS[currentIndex + 1] ?? null;
  const progress = Math.round(((currentIndex + 1) / MOCK_LESSONS.length) * 100);

  const score = quizSubmitted
    ? MOCK_QUIZ.filter((q) => selectedAnswers[q.id] === q.answer).length
    : 0;

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-65px)] gap-4">
        <p className="text-gray-400 text-sm">Leçon introuvable.</p>
        <Link href={`/student/cours/${courseId}`} className="text-purple-400 text-sm hover:underline">
          ← Retour au cours
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] overflow-hidden">
      {/* Progress bar */}
      <div className="h-1 bg-white/5 dark:bg-gray-200 shrink-0">
        <div
          className="h-full bg-purple-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 dark:border-gray-200 bg-[#0f0f1a] dark:bg-white shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href={`/student/cours/${courseId}`}
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900 transition-colors"
          >
            ← Retour au cours
          </Link>
          <span className="text-gray-600 dark:text-gray-300 text-xs">·</span>
          <span className="text-xs text-gray-500">{currentIndex + 1} / {MOCK_LESSONS.length}</span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-medium">
          {TYPE_ICONS[lesson.type]} {TYPE_LABELS[lesson.type]}
        </span>
      </div>

      {/* Lesson title */}
      <div className="px-8 pt-5 pb-2 shrink-0 max-w-3xl mx-auto w-full">
        <h1 className="text-xl font-bold text-white dark:text-gray-900">{lesson.title}</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {lesson.type === "theory" && (
          <TheoryTab content={THEORY_CONTENT} />
        )}

        {lesson.type === "quiz" && (
          <div className="h-full overflow-y-auto px-6 py-4 max-w-2xl mx-auto w-full">
            {quizSubmitted ? (
              <div className="flex flex-col items-center gap-6 py-8">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold border-4 ${
                  score === MOCK_QUIZ.length ? "border-green-500 text-green-400" :
                  score >= MOCK_QUIZ.length / 2 ? "border-yellow-500 text-yellow-400" :
                  "border-red-500 text-red-400"
                }`}>
                  {score}/{MOCK_QUIZ.length}
                </div>
                <p className="text-white dark:text-gray-900 font-semibold">
                  {score === MOCK_QUIZ.length ? "Parfait ! 🎉" : score >= MOCK_QUIZ.length / 2 ? "Bien joué ! 👍" : "À retravailler 💪"}
                </p>
                <button
                  onClick={() => { setSelectedAnswers({}); setQuizSubmitted(false); }}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors"
                >
                  🔄 Recommencer
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {MOCK_QUIZ.map((q, qi) => (
                  <div key={q.id} className="rounded-xl border border-white/10 dark:border-gray-200 bg-white/5 dark:bg-gray-50 p-4 flex flex-col gap-3">
                    <p className="text-sm font-medium text-white dark:text-gray-900">
                      <span className="text-gray-500 mr-2">Q{qi + 1}.</span>{q.question}
                    </p>
                    <div className="flex flex-col gap-2">
                      {q.options.map((opt, oi) => (
                        <button
                          key={oi}
                          onClick={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: oi }))}
                          className={`text-left text-sm px-4 py-2.5 rounded-xl border transition-colors ${
                            selectedAnswers[q.id] === oi
                              ? "border-purple-500 bg-purple-500/20 text-purple-300 dark:text-purple-700"
                              : "border-white/10 dark:border-gray-200 text-gray-400 dark:text-gray-600 hover:bg-white/5 dark:hover:bg-gray-100"
                          }`}
                        >
                          <span className="text-gray-500 mr-2">{String.fromCharCode(65 + oi)}.</span>{opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => { if (Object.keys(selectedAnswers).length === MOCK_QUIZ.length) setQuizSubmitted(true); }}
                  disabled={Object.keys(selectedAnswers).length < MOCK_QUIZ.length}
                  className="self-end px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                >
                  Valider →
                </button>
              </div>
            )}
          </div>
        )}

        {lesson.type === "code" && (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 dark:border-gray-200 bg-white/5 dark:bg-gray-50 shrink-0">
              <span className="text-xs text-gray-500">index.js</span>
              <div className="ml-auto">
                <button className="text-xs px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors">
                  ▶ Exécuter
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <CodeEditor
                value={codeContent}
                onChange={setCodeContent}
                language="javascript"
                minHeight="100%"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 dark:border-gray-200 bg-[#0f0f1a] dark:bg-white shrink-0">
        {prevLesson ? (
          <Link
            href={`/student/cours/${courseId}/${prevLesson.id}`}
            className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900 transition-colors"
          >
            ← {prevLesson.title}
          </Link>
        ) : <div />}

        {nextLesson ? (
          <Link
            href={`/student/cours/${courseId}/${nextLesson.id}`}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors"
          >
            {nextLesson.title} →
          </Link>
        ) : (
          <Link
            href={`/student/cours/${courseId}`}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors"
          >
            ✓ Terminer le cours
          </Link>
        )}
      </div>
    </div>
  );
}
