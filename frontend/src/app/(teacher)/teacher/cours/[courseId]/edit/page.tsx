"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { TYPE_STYLES, TYPE_LABELS } from "@/lib/constants/lessonTypes";

const LESSONS = [
  { id: 1, title: "Introduction & Setup", type: "theory", duration: "15min" },
  { id: 2, title: "Variables & Types", type: "theory", duration: "20min" },
  { id: 3, title: "Quiz — Les bases", type: "quiz", duration: "10min" },
  { id: 4, title: "Exercice pratique", type: "practice", duration: "30min" },
];


export default function CourseEditPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [title, setTitle] = useState("JavaScript Avancé");
  const [description, setDescription] = useState("Closures, prototypes, async/await et patterns ES2024.");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="px-6 py-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <Link href="/teacher/cours" className="text-gray-400 hover:text-white dark:hover:text-gray-900 text-xs transition-colors mb-3 inline-block">
              ← Retour aux cours
            </Link>
            <h1 className="text-3xl font-bold text-white dark:text-gray-900">Modifier le cours</h1>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Cours #{courseId}</p>
          </div>
          <button
            onClick={handleSave}
            className={`text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors ${saved ? "bg-emerald-600 text-white" : "bg-green-600 hover:bg-green-700 text-white"}`}
          >
            {saved ? "✓ Sauvegardé" : "Sauvegarder"}
          </button>
        </div>

        {/* Course info */}
        <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-5">
          <h2 className="font-semibold text-white dark:text-gray-900">Informations générales</h2>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase">Titre</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/5 dark:bg-gray-100 border border-white/10 dark:border-gray-200 text-white dark:text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="bg-white/5 dark:bg-gray-100 border border-white/10 dark:border-gray-200 text-white dark:text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>
        </div>

        {/* Lessons */}
        <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white dark:text-gray-900">Leçons ({LESSONS.length})</h2>
            <button className="text-green-400 hover:text-green-300 text-xs font-medium transition-colors">
              + Ajouter une leçon
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {LESSONS.map((lesson, i) => (
              <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 dark:bg-gray-50 group">
                <span className="text-gray-500 text-xs w-4">{i + 1}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_STYLES[lesson.type]}`}>
                  {TYPE_LABELS[lesson.type]}
                </span>
                <span className="text-sm text-white dark:text-gray-900 flex-1">{lesson.title}</span>
                <span className="text-xs text-gray-500">{lesson.duration}</span>
                <button className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 text-xs transition-all">✕</button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
