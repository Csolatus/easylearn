"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

const API = process.env.NEXT_PUBLIC_API_URL;

type Course = {
  id: string;
  title: string;
  visibility: string;
  created_at: string;
  updated_at: string;
};

const VISIBILITY_BADGE: Record<string, string> = {
  public:  "bg-green-500/10 text-green-400 dark:text-green-600",
  school:  "bg-blue-500/10 text-blue-400 dark:text-blue-600",
  private: "bg-gray-500/10 text-gray-400 dark:text-gray-500",
};

const VISIBILITY_LABEL: Record<string, string> = {
  public:  "Public",
  school:  "École",
  private: "Privé",
};

const TABS = [
  { label: "Tous", value: "all" },
  { label: "Public", value: "public" },
  { label: "École", value: "school" },
  { label: "Privé", value: "private" },
];

export default function CoursPage() {
  const token = useAuthStore((s) => s.token);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState<"public" | "school" | "private">("private");
  const [submitting, setSubmitting] = useState(false);
  const [wizardError, setWizardError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/courses`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : [])
      .then((data: Course[]) => setCourses(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [token]);

  async function handleCreateCourse() {
    if (!title.trim()) { setWizardError("Le titre est requis."); return; }
    setWizardError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ title: title.trim(), visibility }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setWizardError(data.detail ?? "Erreur lors de la création.");
        return;
      }
      const created: Course = await res.json();
      setCourses((prev) => [created, ...prev]);
      setShowWizard(false);
      setTitle("");
      setVisibility("private");
      setWizardStep(1);
    } catch {
      setWizardError("Impossible de joindre le serveur.");
    } finally {
      setSubmitting(false);
    }
  }

  const filtered = courses.filter((c) =>
    activeTab === "all" ? true : c.visibility === activeTab
  );

  return (
    <div className="px-6 py-8 space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white dark:text-gray-900">Mes cours</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            {isLoading ? "Chargement…" : `${courses.length} cours créé${courses.length > 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={() => { setShowWizard(true); setWizardStep(1); setTitle(""); setVisibility("private"); setWizardError(null); }}
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          + Nouveau cours
        </button>
      </div>

      {/* Tabs */}
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

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty */}
      {!isLoading && filtered.length === 0 && (
        <p className="text-center text-sm text-gray-500 py-16">
          {courses.length === 0 ? "Aucun cours créé. Commencez maintenant !" : "Aucun cours dans cette catégorie."}
        </p>
      )}

      {/* Grid */}
      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((course) => (
            <div key={course.id} className="rounded-2xl border border-white/10 dark:border-gray-200 bg-[#111118] dark:bg-white shadow-md overflow-hidden flex flex-col group">
              <div className="relative h-32 bg-gradient-to-br from-green-900/60 to-teal-900/60 flex items-center justify-center">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                <span className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-medium ${VISIBILITY_BADGE[course.visibility]}`}>
                  {VISIBILITY_LABEL[course.visibility]}
                </span>
                <span className="text-4xl">📖</span>
              </div>

              <div className="p-5 flex flex-col gap-3 flex-1">
                <h3 className="font-bold text-white dark:text-gray-900 text-base leading-snug">{course.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-auto">
                  Mis à jour le {new Date(course.updated_at).toLocaleDateString("fr-FR")}
                </p>
                <div className="flex gap-2 pt-1">
                  <Link
                    href={`/teacher/cours/${course.id}`}
                    className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
                  >
                    ✏️ Modifier
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Wizard */}
      {showWizard && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111118] dark:bg-white rounded-2xl border border-white/10 dark:border-gray-300 shadow-2xl">
            <div className="px-6 py-5 border-b border-white/10 dark:border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white dark:text-gray-900">Nouveau cours</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Étape {wizardStep} sur 2</p>
              </div>
              <button onClick={() => setShowWizard(false)} className="text-gray-400 hover:text-white dark:hover:text-gray-900 transition-colors text-lg">✕</button>
            </div>

            <div className="px-6 py-2 flex gap-2">
              {[1, 2].map((s) => (
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
                    autoFocus
                    className="bg-white/5 dark:bg-gray-100 border border-white/10 dark:border-gray-300 text-white dark:text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
                  />
                </div>
              </div>
            )}

            {wizardStep === 2 && (
              <div className="px-6 py-5 flex flex-col gap-4">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Visibilité</p>
                <div className="flex flex-col gap-3">
                  {(["private", "school", "public"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setVisibility(v)}
                      className={`flex items-center gap-3 py-3 px-4 rounded-xl border text-left transition-colors ${
                        visibility === v
                          ? "border-green-500 bg-green-500/10 text-green-400"
                          : "border-white/10 dark:border-gray-200 text-gray-400 dark:text-gray-600 hover:border-green-500/50"
                      }`}
                    >
                      <span className="text-lg">{v === "public" ? "🌍" : v === "school" ? "🏫" : "🔒"}</span>
                      <div>
                        <p className="text-sm font-medium">{VISIBILITY_LABEL[v]}</p>
                        <p className="text-xs opacity-70">
                          {v === "public" ? "Visible par tous les étudiants" : v === "school" ? "Visible par l'école associée" : "Visible uniquement par vous"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
                {wizardError && <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{wizardError}</p>}
              </div>
            )}

            <div className="px-6 py-4 border-t border-white/10 dark:border-gray-200 flex justify-between">
              <button
                onClick={() => wizardStep === 1 ? setShowWizard(false) : setWizardStep(1)}
                className="text-sm text-gray-400 hover:text-white dark:hover:text-gray-900 transition-colors"
              >
                {wizardStep === 1 ? "Annuler" : "← Retour"}
              </button>
              {wizardStep === 1 ? (
                <button
                  onClick={() => setWizardStep(2)}
                  disabled={!title.trim()}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
                >
                  Suivant →
                </button>
              ) : (
                <button
                  onClick={handleCreateCourse}
                  disabled={submitting}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
                >
                  {submitting ? "Création..." : "✅ Créer le cours"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
