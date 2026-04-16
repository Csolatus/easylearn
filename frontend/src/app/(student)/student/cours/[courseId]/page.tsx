"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import TheoryTab from "@/components/course/TheoryTab";
import QuizTab from "@/components/course/QuizTab";
import PracticeTab from "@/components/course/PracticeTab";

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
    question: "Quelle méthode permet de transformer chaque élément d'un tableau ?",
    options: ["filter()", "reduce()", "map()", "forEach()"],
    answer: 2,
  },
  {
    id: 3,
    question: "Les fonctions fléchées redéfinissent-elles `this` ?",
    options: ["Oui, toujours", "Non, jamais", "Seulement en mode strict", "Ça dépend du contexte"],
    answer: 1,
  },
];

const CODE_STARTER = `// Exercice : Créez une fonction de mémoïsation
function memoize(fn) {
  // Votre code ici...
}

// Test
const slowSquare = (n) => {
  console.log("Calculating...");
  return n * n;
};

const fastSquare = memoize(slowSquare);
console.log(fastSquare(4)); // Calculating... 16
console.log(fastSquare(4)); // 16 (from cache)
`;

const INITIAL_LESSONS = [
  { id: 1, title: "Introduction & Setup", type: "theory", done: true },
  { id: 2, title: "Variables & Types", type: "theory", done: true },
  { id: 3, title: "Fonctions avancées", type: "theory", done: false },
  { id: 4, title: "Quiz — Les bases", type: "quiz", done: false },
  { id: 5, title: "Exercice pratique", type: "code", done: false },
];

const TYPE_STYLES: Record<string, string> = {
  theory: "bg-blue-500/20 text-blue-400",
  quiz: "bg-yellow-500/20 text-yellow-400",
  code: "bg-green-500/20 text-green-400",
};

const TYPE_ICONS: Record<string, string> = {
  theory: "📝",
  quiz: "🧠",
  code: "💻",
};

const TABS = ["Théorie", "Pratique", "Quiz"];

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
const greet = name => \`Hello, \${name}!\`;
\`\`\`

## Higher-Order Functions
Une higher-order function prend une fonction en argument ou en retourne une.

\`\`\`js
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((acc, n) => acc + n, 0);
\`\`\`

## Mémoïsation
La mémoïsation est une technique d'optimisation qui met en cache les résultats.

\`\`\`js
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
\`\`\`

## Conclusion
Ces concepts sont fondamentaux pour écrire du JavaScript moderne et performant. Pratiquez-les dans l'onglet **Pratique** et testez vos connaissances dans le **Quiz**.
`;

export default function StudentLessonPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [lessons, setLessons] = useState(INITIAL_LESSONS);
  const [activeLesson, setActiveLesson] = useState(3);
  const [activeTab, setActiveTab] = useState("Théorie");

  const markAsRead = () => {
    setLessons((prev) =>
      prev.map((l) => l.id === activeLesson ? { ...l, done: true } : l)
    );
  };
  const [readProgress, setReadProgress] = useState(0);

  const currentLesson = lessons.find((l) => l.id === activeLesson);
  const isCurrentDone = currentLesson?.done ?? false;



  return (
    <div className="flex h-[calc(100vh-65px)] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-white/10 dark:border-gray-200 bg-[#0d0d1a] dark:bg-gray-50 flex flex-col overflow-y-auto">
        <div className="px-4 py-4 border-b border-white/10 dark:border-gray-200">
          <Link
            href="/student/catalogue"
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900 transition-colors"
          >
            ← Retour au catalogue
          </Link>
          <p className="text-xs font-semibold text-white dark:text-gray-900 mt-2">Cours #{courseId}</p>
          <p className="text-xs text-gray-500 mt-0.5">JavaScript Avancé</p>

          {/* Overall progress */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progression</span>
              <span>{lessons.filter((l) => l.done).length}/{lessons.length} leçons</span>
            </div>
            <div className="h-1.5 bg-white/10 dark:bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all"
                style={{ width: `${(lessons.filter((l) => l.done).length / lessons.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="px-3 py-3 flex-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">Leçons</p>
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => { setActiveLesson(lesson.id); setActiveTab("Théorie"); setReadProgress(0); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors mb-1 ${
                activeLesson === lesson.id
                  ? "bg-purple-600/20 text-purple-400"
                  : "text-gray-400 dark:text-gray-500 hover:bg-white/5 dark:hover:bg-gray-100"
              }`}
            >
              <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${TYPE_STYLES[lesson.type]}`}>
                {TYPE_ICONS[lesson.type]}
              </span>
              <span className="text-xs truncate">{lesson.title}</span>
              {lesson.done && <span className="ml-auto text-green-500 text-xs shrink-0">✓</span>}
            </button>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 dark:border-gray-200 bg-[#0f0f1a] dark:bg-white shrink-0">
          <div>
            <h1 className="text-sm font-semibold text-white dark:text-gray-900">{currentLesson?.title}</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">JavaScript Avancé</p>
          </div>
          <button
            onClick={markAsRead}
            disabled={isCurrentDone}
            className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${
              isCurrentDone
                ? "bg-green-600/20 text-green-400 cursor-default"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            {isCurrentDone ? "✓ Leçon complétée" : "Marquer comme lu"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 dark:border-gray-200 bg-white/5 dark:bg-gray-50 shrink-0">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? "border-purple-500 text-purple-400 dark:text-purple-600"
                  : "border-transparent text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "Théorie" && (
            <TheoryTab content={THEORY_CONTENT} onProgressChange={setReadProgress} />
          )}

          {activeTab === "Pratique" && (
            <PracticeTab
              initialCode={CODE_STARTER}
              language="javascript"
              objective="Utilisez useEffect pour simuler un abonnement à un statut. N'oubliez pas de retourner une fonction de nettoyage."
              objectiveProgress={65}
            />
          )}

          {activeTab === "Quiz" && (
            <QuizTab questions={MOCK_QUIZ} />
          )}
        </div>
      </div>
    </div>
  );
}
