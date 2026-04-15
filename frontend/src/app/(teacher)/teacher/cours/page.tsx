"use client";

import { useState } from "react";
import Link from "next/link";

const MOCK_COURSES = [
  { id: 1, title: "JavaScript Avancé", description: "Closures, prototypes, async/await et patterns ES2024.", lessons: 12, students: 24, status: "published" },
  { id: 2, title: "Introduction à Python", description: "Les bases de Python avec des projets pratiques.", lessons: 8, students: 18, status: "published" },
  { id: 3, title: "React — Les Fondamentaux", description: "Composants, hooks, state management avec React 19.", lessons: 15, students: 30, status: "draft" },
  { id: 4, title: "SQL & Bases de données", description: "Requêtes SQL, jointures, optimisation de requêtes.", lessons: 6, students: 0, status: "archived" },
];

const STATUS_BADGE: Record<string, string> = {
  published: "bg-green-500/10 text-green-400 dark:text-green-600",
  draft: "bg-yellow-500/10 text-yellow-400 dark:text-yellow-600",
  archived: "bg-gray-500/10 text-gray-400 dark:text-gray-500",
};

const STATUS_LABEL: Record<string, string> = {
  published: "Publié",
  draft: "Brouillon",
  archived: "Archivé",
};

const TABS = [
  { label: "Tous", value: "all" },
  { label: "Publié", value: "published" },
  { label: "Brouillon", value: "draft" },
  { label: "Archivé", value: "archived" },
];

export default function CoursPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [lessons, setLessons] = useState<string[]>([""]);

  const addLesson = () => setLessons((prev) => [...prev, ""]);
  const updateLesson = (i: number, val: string) => setLessons((prev) => prev.map((l, idx) => idx === i ? val : l));
  const removeLesson = (i: number) => setLessons((prev) => prev.filter((_, idx) => idx !== i));

  const CATEGORIES = ["Web Development", "Data Science", "AI & ML", "Design", "DevOps"];

  const filtered = MOCK_COURSES.filter((c) =>
    activeTab === "all" ? true : c.status === activeTab
  );

  return (
    <div className="px-6 py-8 space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white dark:text-gray-900">Mes cours</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Gérez et créez vos cours
          </p>
        </div>
        <button
          onClick={() => { setShowWizard(true); setWizardStep(1); }}
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          + Nouveau cours
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-green-600 text-white"
                : "bg-white/5 dark:bg-gray-100 text-gray-400 dark:text-gray-600 hover:bg-white/10 dark:hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {showWizard && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#111118] dark:bg-white rounded-2xl border border-white/10 dark:border-gray-300 shadow-2xl">
            <div className="px-6 py-5 border-b border-white/10 dark:border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white dark:text-gray-900">Nouveau cours</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Étape {wizardStep} sur 3</p>
              </div>
              <button onClick={() => setShowWizard(false)} className="text-gray-400 hover:text-white dark:hover:text-gray-900 transition-colors text-lg">✕</button>
            </div>

            <div className="px-6 py-2 flex gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= wizardStep ? "bg-green-500" : "bg-white/10 dark:bg-gray-200"}`} />
              ))}
            </div>

            {wizardStep === 1 && (
              <div className="px-6 py-5 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Titre du cours</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ex: Introduction à React"
                    className="bg-white/5 dark:bg-gray-100 border border-white/10 dark:border-gray-300 text-white dark:text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez votre cours..."
                    rows={3}
                    className="bg-white/5 dark:bg-gray-100 border border-white/10 dark:border-gray-300 text-white dark:text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 resize-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Catégorie</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-white/5 dark:bg-gray-100 border border-white/10 dark:border-gray-300 text-white dark:text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-[#111118] dark:bg-white">{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {wizardStep === 3 && (
              <div className="px-6 py-5 flex flex-col gap-4">
                <div className="rounded-xl border border-white/10 dark:border-gray-200 bg-white/5 dark:bg-gray-50 px-4 py-4 flex flex-col gap-2">
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Récapitulatif</p>
                  <p className="text-sm font-medium text-white dark:text-gray-900">{title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{category} · {lessons.filter(Boolean).length} leçon(s)</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Statut de publication</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {}}
                      className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-xs font-medium"
                    >
                      <span className="text-lg">📝</span>
                      Brouillon
                    </button>
                    <button
                      onClick={() => {}}
                      className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-medium"
                    >
                      <span className="text-lg">🚀</span>
                      Publier
                    </button>
                  </div>
                </div>
              </div>
            )}

            {wizardStep === 2 && (
              <div className="px-6 py-5 flex flex-col gap-4">
                <p className="text-xs text-gray-400 dark:text-gray-500">Ajoutez les leçons de votre cours. Vous pourrez les éditer ensuite.</p>
                <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
                  {lessons.map((lesson, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-5 shrink-0">{i + 1}.</span>
                      <input
                        value={lesson}
                        onChange={(e) => updateLesson(i, e.target.value)}
                        placeholder={`Titre de la leçon ${i + 1}`}
                        className="flex-1 bg-white/5 dark:bg-gray-100 border border-white/10 dark:border-gray-300 text-white dark:text-gray-900 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
                      />
                      {lessons.length > 1 && (
                        <button onClick={() => removeLesson(i)} className="text-gray-500 hover:text-red-400 transition-colors text-sm shrink-0">✕</button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addLesson}
                  className="self-start text-xs text-green-400 hover:text-green-300 transition-colors font-medium"
                >
                  + Ajouter une leçon
                </button>
              </div>
            )}

            <div className="px-6 py-4 border-t border-white/10 dark:border-gray-200 flex justify-between">
              <button
                onClick={() => wizardStep === 1 ? setShowWizard(false) : setWizardStep(wizardStep - 1)}
                className="text-sm text-gray-400 hover:text-white dark:hover:text-gray-900 transition-colors"
              >
                {wizardStep === 1 ? "Annuler" : "← Retour"}
              </button>
              {wizardStep < 3 ? (
                <button
                  onClick={() => setWizardStep(wizardStep + 1)}
                  disabled={wizardStep === 1 && !title}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
                >
                  Suivant →
                </button>
              ) : (
                <button
                  onClick={() => setShowWizard(false)}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
                >
                  ✅ Créer le cours
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-gray-500 py-16">Aucun cours trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((course) => (
            <div key={course.id} className="rounded-2xl border border-white/10 dark:border-gray-300 bg-[#111118] dark:bg-white shadow-md overflow-hidden">
              <div className="h-20 bg-gradient-to-br from-green-900/60 to-teal-900/60 dark:from-green-100 dark:to-teal-100" />
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-white dark:text-gray-900 text-sm leading-snug">{course.title}</h3>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium shrink-0 ${STATUS_BADGE[course.status]}`}>
                    {STATUS_LABEL[course.status]}
                  </span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                  <span>📚 {course.lessons} leçons</span>
                  <span>👥 {course.students} étudiants</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <Link
                    href={`/teacher/cours/${course.id}`}
                    className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                  >
                    Modifier
                  </Link>
                  <button className="px-3 py-2 bg-white/5 dark:bg-gray-100 hover:bg-white/10 dark:hover:bg-gray-200 rounded-lg text-gray-400 text-xs transition-colors">
                    ···
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
