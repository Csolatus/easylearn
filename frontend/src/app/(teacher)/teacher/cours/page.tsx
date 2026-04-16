"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import Spinner from "@/components/ui/Spinner";
import CourseCardTeacher from "./CourseCardTeacher";
import CreateCourseWizard from "./CreateCourseWizard";

const API = process.env.NEXT_PUBLIC_API_URL;

type Course = { id: string; title: string; visibility: string; created_at: string; updated_at: string };

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
    setWizardError(null); setSubmitting(true);
    try {
      const res = await fetch(`${API}/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ title: title.trim(), visibility }),
      });
      if (!res.ok) { const data = await res.json().catch(() => ({})); setWizardError(data.detail ?? "Erreur lors de la création."); return; }
      const created: Course = await res.json();
      setCourses((prev) => [created, ...prev]);
      setShowWizard(false); setTitle(""); setVisibility("private"); setWizardStep(1);
    } catch { setWizardError("Impossible de joindre le serveur."); }
    finally { setSubmitting(false); }
  }

  const filtered = courses.filter((c) => activeTab === "all" ? true : c.visibility === activeTab);

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

      <div className="flex gap-2 flex-wrap">
        {TABS.map((tab) => (
          <button key={tab.value} onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === tab.value ? "bg-green-600 text-white" : "bg-white/5 dark:bg-gray-100 text-gray-400 dark:text-gray-600 hover:bg-white/10 dark:hover:bg-gray-200"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading && <div className="flex justify-center py-16"><Spinner color="border-green-500" /></div>}
      {!isLoading && filtered.length === 0 && (
        <p className="text-center text-sm text-gray-500 py-16">
          {courses.length === 0 ? "Aucun cours créé. Commencez maintenant !" : "Aucun cours dans cette catégorie."}
        </p>
      )}
      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((course) => <CourseCardTeacher key={course.id} course={course} />)}
        </div>
      )}

      {showWizard && (
        <CreateCourseWizard
          step={wizardStep}
          title={title}
          visibility={visibility}
          submitting={submitting}
          error={wizardError}
          onTitleChange={setTitle}
          onVisibilityChange={setVisibility}
          onNext={() => setWizardStep(2)}
          onBack={() => setWizardStep(1)}
          onClose={() => setShowWizard(false)}
          onCreate={handleCreateCourse}
        />
      )}
    </div>
  );
}
