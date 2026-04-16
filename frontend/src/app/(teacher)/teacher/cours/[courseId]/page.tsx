"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import MarkdownRenderer from "@/components/course/MarkdownRenderer";
import { TYPE_STYLES, TYPE_ICONS } from "@/lib/constants/lessonTypes";

const MOCK_LESSONS = [
  { id: 1, title: "Introduction & Setup", type: "theory", done: true },
  { id: 2, title: "Variables & Types", type: "theory", done: true },
  { id: 3, title: "Fonctions avancées", type: "theory", done: false },
  { id: 4, title: "Quiz — Les bases", type: "quiz", done: false },
  { id: 5, title: "Exercice pratique", type: "code", done: false },
];


const EDITOR_TABS = ["Théorie", "Pratique", "Quiz"];

const MARKDOWN_PLACEHOLDER = `# Fonctions avancées en JavaScript

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
`;

const CODE_PLACEHOLDER = `// Exercice : Créez une fonction de mémoïsation
function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
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

export default function LessonEditorPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [activeLesson, setActiveLesson] = useState(3);
  const [activeTab, setActiveTab] = useState("Théorie");
  const [mdContent, setMdContent] = useState(MARKDOWN_PLACEHOLDER);
  const [codeContent, setCodeContent] = useState(CODE_PLACEHOLDER);
  const [saved, setSaved] = useState(false);
  const [questions, setQuestions] = useState([
    { question: "Qu'est-ce qu'une closure en JavaScript ?", options: ["Une fonction simple", "Une fonction qui capture son environnement", "Un objet", "Une classe"], answer: 1 },
  ]);

  const addQuestion = () => setQuestions((prev) => [...prev, { question: "", options: ["", "", "", ""], answer: 0 }]);
  const updateQuestion = (i: number, val: string) => setQuestions((prev) => prev.map((q, idx) => idx === i ? { ...q, question: val } : q));
  const updateOption = (qi: number, oi: number, val: string) => setQuestions((prev) => prev.map((q, idx) => idx === qi ? { ...q, options: q.options.map((o, oidx) => oidx === oi ? val : o) } : q));
  const setAnswer = (qi: number, oi: number) => setQuestions((prev) => prev.map((q, idx) => idx === qi ? { ...q, answer: oi } : q));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const currentLesson = MOCK_LESSONS.find((l) => l.id === activeLesson);

  return (
    <div className="flex h-[calc(100vh-65px)] overflow-hidden">
      {/* Sidebar leçons */}
      <aside className="w-64 shrink-0 border-r border-white/10 dark:border-gray-200 bg-[#0d0d1a] dark:bg-gray-50 flex flex-col overflow-y-auto">
        <div className="px-4 py-4 border-b border-white/10 dark:border-gray-200">
          <Link href="/teacher/cours" className="text-xs text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900 transition-colors">
            ← Retour aux cours
          </Link>
          <p className="text-xs font-semibold text-white dark:text-gray-900 mt-2">Cours #{courseId}</p>
          <p className="text-xs text-gray-500 mt-0.5">JavaScript Avancé</p>
        </div>

        <div className="px-3 py-3 flex-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">Leçons</p>
          {MOCK_LESSONS.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => setActiveLesson(lesson.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors mb-1 ${
                activeLesson === lesson.id
                  ? "bg-green-600/20 text-green-400"
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
          <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-green-400 hover:text-green-300 transition-colors mt-2">
            + Ajouter une leçon
          </button>
        </div>
      </aside>

      {/* Main editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 dark:border-gray-200 bg-[#0f0f1a] dark:bg-white shrink-0">
          <div>
            <h1 className="text-sm font-semibold text-white dark:text-gray-900">{currentLesson?.title}</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Édition en cours</p>
          </div>
          <button
            onClick={handleSave}
            className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${
              saved ? "bg-emerald-600 text-white" : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {saved ? "✓ Sauvegardé" : "Sauvegarder"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 dark:border-gray-200 bg-white/5 dark:bg-gray-50 shrink-0">
          {EDITOR_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? "border-green-500 text-green-400 dark:text-green-600"
                  : "border-transparent text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Editor content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "Théorie" && (
            <div className="grid grid-cols-2 h-full divide-x divide-white/10 dark:divide-gray-200">
              <textarea
                value={mdContent}
                onChange={(e) => setMdContent(e.target.value)}
                className="h-full bg-transparent text-white dark:text-gray-900 text-sm font-mono p-5 focus:outline-none resize-none"
              />
              <div className="h-full overflow-y-auto p-5">
                <MarkdownRenderer content={mdContent} />
              </div>
            </div>
          )}

          {activeTab === "Pratique" && (
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 px-5 py-2.5 border-b border-white/10 dark:border-gray-200 bg-white/5 dark:bg-gray-50 shrink-0">
                <span className="text-xs text-gray-500">Langage :</span>
                <select className="bg-transparent text-xs text-white dark:text-gray-900 focus:outline-none cursor-pointer font-medium">
                  <option className="bg-[#111118]">JavaScript</option>
                  <option className="bg-[#111118]">Python</option>
                  <option className="bg-[#111118]">TypeScript</option>
                  <option className="bg-[#111118]">SQL</option>
                </select>
              </div>
              <textarea
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                className="flex-1 bg-transparent text-green-400 dark:text-green-700 text-sm font-mono p-5 focus:outline-none resize-none"
                spellCheck={false}
              />
            </div>
          )}

          {activeTab === "Quiz" && (
            <div className="h-full overflow-y-auto p-5 flex flex-col gap-5">
              {questions.map((q, qi) => (
                <div key={qi} className="flex flex-col gap-3 rounded-xl border border-white/10 dark:border-gray-200 bg-white/5 dark:bg-gray-50 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 shrink-0">Q{qi + 1}</span>
                    <input
                      value={q.question}
                      onChange={(e) => updateQuestion(qi, e.target.value)}
                      placeholder="Écrivez votre question..."
                      className="flex-1 bg-white/5 dark:bg-white border border-white/10 dark:border-gray-300 text-white dark:text-gray-900 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((option, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        <button
                          onClick={() => setAnswer(qi, oi)}
                          aria-label={`Sélectionner l'option ${oi + 1}`}
                          className={`w-5 h-5 rounded-full border-2 shrink-0 transition-colors ${
                            q.answer === oi ? "border-green-500 bg-green-500" : "border-white/20 dark:border-gray-400"
                          }`}
                        />
                        <input
                          value={option}
                          onChange={(e) => updateOption(qi, oi, e.target.value)}
                          placeholder={`Option ${oi + 1}`}
                          className="flex-1 bg-white/5 dark:bg-white border border-white/10 dark:border-gray-300 text-white dark:text-gray-900 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={addQuestion} className="self-start text-xs text-green-400 hover:text-green-300 font-medium transition-colors">
                + Ajouter une question
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
