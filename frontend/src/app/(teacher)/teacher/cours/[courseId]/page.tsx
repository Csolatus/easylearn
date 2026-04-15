"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const EDITOR_TABS = [
  { label: "Markdown", value: "markdown", icon: "📝" },
  { label: "Code", value: "code", icon: "💻" },
  { label: "Quiz", value: "quiz", icon: "🧠" },
];

const MARKDOWN_PLACEHOLDER = `# Titre de la leçon

## Introduction
Écrivez votre contenu ici en **Markdown**.

- Point 1
- Point 2
- Point 3

## Exemple de code
\`\`\`js
const hello = () => console.log("Hello World");
\`\`\`
`;

const CODE_PLACEHOLDER = `// Écrivez votre code exemple ici
function exemple() {
  const message = "Hello World";
  console.log(message);
  return message;
}

exemple();
`;

export default function LessonEditorPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [activeTab, setActiveTab] = useState("markdown");
  const [mdContent, setMdContent] = useState(MARKDOWN_PLACEHOLDER);
  const [codeContent, setCodeContent] = useState(CODE_PLACEHOLDER);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <Link href="/teacher/cours" className="text-xs text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900 transition-colors mb-2 inline-block">
            ← Retour aux cours
          </Link>
          <h1 className="text-2xl font-bold text-white dark:text-gray-900">Éditeur de leçon</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Cours #{courseId}</p>
        </div>
        <button
          onClick={handleSave}
          className={`text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors ${
            saved ? "bg-emerald-600 text-white" : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {saved ? "✓ Sauvegardé" : "Sauvegarder"}
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 dark:border-gray-300 bg-[#111118] dark:bg-white shadow-md overflow-hidden">
        <div className="flex border-b border-white/10 dark:border-gray-200 bg-white/5 dark:bg-gray-50">
          {EDITOR_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.value
                  ? "border-green-500 text-green-400 dark:text-green-600"
                  : "border-transparent text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "markdown" && (
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 dark:divide-gray-200">
            <textarea
              value={mdContent}
              onChange={(e) => setMdContent(e.target.value)}
              className="h-96 bg-transparent text-white dark:text-gray-900 text-sm font-mono p-5 focus:outline-none resize-none placeholder-gray-600"
              placeholder="Écrivez votre contenu en Markdown..."
            />
            <div className="h-96 overflow-y-auto p-5 text-sm text-gray-300 dark:text-gray-700 prose prose-invert dark:prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm">{mdContent}</pre>
            </div>
          </div>
        )}

        {activeTab === "code" && (
          <div className="flex flex-col">
            <div className="flex items-center gap-2 px-5 py-2 border-b border-white/10 dark:border-gray-200 bg-white/5 dark:bg-gray-50">
              <span className="text-xs text-gray-500">Langage :</span>
              <select className="bg-transparent text-xs text-white dark:text-gray-900 focus:outline-none cursor-pointer">
                <option className="bg-[#111118]">JavaScript</option>
                <option className="bg-[#111118]">Python</option>
                <option className="bg-[#111118]">TypeScript</option>
                <option className="bg-[#111118]">SQL</option>
              </select>
            </div>
            <textarea
              value={codeContent}
              onChange={(e) => setCodeContent(e.target.value)}
              className="h-96 bg-transparent text-green-400 dark:text-green-700 text-sm font-mono p-5 focus:outline-none resize-none"
              spellCheck={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
