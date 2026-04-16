"use client";

import { useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { useAuthStore } from "@/store/authStore";
import { useSchoolStore } from "@/store/schoolStore";

type ClassItem = {
  id: string | number;
  name: string;
  students: number;
  courses: number;
  completion: number;
  active: boolean;
  school_id?: string | null;
};

const INITIAL_CLASSES: ClassItem[] = [
  { id: 1, name: "JS Avancé — Groupe A", students: 24, courses: 3, completion: 72, active: true },
  { id: 2, name: "Python Débutant — Groupe B", students: 18, courses: 5, completion: 45, active: true },
  { id: 3, name: "React Fondamentaux", students: 30, courses: 4, completion: 88, active: true },
  { id: 4, name: "SQL & Bases de données", students: 15, courses: 2, completion: 30, active: false },
];

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>(INITIAL_CLASSES);
  const [search, setSearch] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [className, setClassName] = useState("");
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [createdInviteCode, setCreatedInviteCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const token = useAuthStore((s) => s.token);
  const schools = useSchoolStore((s) => s.schools);

  function openModal() {
    setClassName("");
    setSelectedSchoolId("");
    setFormError(null);
    setCreatedInviteCode(null);
    setCopied(false);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setCreatedInviteCode(null);
  }

  async function handleCreate() {
    if (!className.trim()) {
      setFormError("Le nom de la classe est requis.");
      return;
    }
    setFormError(null);
    setSubmitting(true);
    try {
      const body: { name: string; school_id?: string } = { name: className.trim() };
      if (selectedSchoolId) body.school_id = selectedSchoolId;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classrooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setFormError(data.detail ?? "Erreur lors de la création.");
        return;
      }

      const created = await res.json();
      setCreatedInviteCode(created.invite_code);
      setClasses((prev) => [
        {
          id: created.id,
          name: created.name,
          students: 0,
          courses: 0,
          completion: 0,
          active: !created.is_archived,
          school_id: created.school_id ?? null,
        },
        ...prev,
      ]);
    } catch {
      setFormError("Impossible de joindre le serveur.");
    } finally {
      setSubmitting(false);
    }
  }

  async function copyInviteCode() {
    if (!createdInviteCode) return;
    await navigator.clipboard.writeText(createdInviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const filtered = classes.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f0f1a] dark:bg-gray-50 px-8 py-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white dark:text-gray-900">Mes classes</h1>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              {classes.length} classes · {classes.reduce((a, c) => a + c.students, 0)} étudiants au total
            </p>
          </div>
          <button
            onClick={openModal}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            + Nouvelle classe
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-sm">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Rechercher une classe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a2e] dark:bg-white dark:text-gray-900 dark:shadow-sm text-white placeholder-gray-500 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Classes list */}
        <div className="flex flex-col gap-4">
          {filtered.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-16">Aucune classe trouvée.</p>
          )}
          {filtered.map((cls) => (
            <Link
              key={cls.id}
              href={`/teacher/classes/${cls.id}`}
              className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 hover:ring-2 hover:ring-green-500/50 transition-all flex flex-col gap-4"
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-600/20 flex items-center justify-center text-lg">🏫</div>
                  <div>
                    <p className="font-semibold text-white dark:text-gray-900">{cls.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {cls.students} élèves · {cls.courses} cours
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {cls.school_id && (
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-500/20 text-blue-400">
                      {schools.find((s) => s.id === cls.school_id)?.name ?? "École"}
                    </span>
                  )}
                  {!cls.school_id && (
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-purple-500/20 text-purple-400">
                      Personnelle
                    </span>
                  )}
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${cls.active ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                    {cls.active ? "Active" : "Archivée"}
                  </span>
                  <span className="text-green-400 font-bold text-sm">{cls.completion}%</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-20">Complétion</span>
                <div className="flex-1 h-1.5 bg-white/10 dark:bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${cls.completion}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-8 text-right">{cls.completion}%</span>
              </div>
            </Link>
          ))}
        </div>

      </div>

      {/* Modal création de classe */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={createdInviteCode ? "Classe créée !" : "Nouvelle classe"}
        size="sm"
        footer={
          createdInviteCode ? (
            <button
              onClick={closeModal}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
            >
              Fermer
            </button>
          ) : (
            <div className="flex gap-3 w-full">
              <button
                onClick={closeModal}
                className="flex-1 bg-white/5 hover:bg-white/10 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreate}
                disabled={submitting}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                {submitting ? "Création..." : "Créer la classe"}
              </button>
            </div>
          )
        }
      >
        {createdInviteCode ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Partagez ce code d&apos;invitation à vos élèves pour qu&apos;ils rejoignent la classe.
            </p>
            <div className="flex items-center gap-2 bg-[#0f0f1a] dark:bg-gray-100 rounded-xl px-4 py-3">
              <span className="flex-1 font-mono text-green-400 dark:text-green-600 text-sm tracking-widest font-bold">
                {createdInviteCode}
              </span>
              <button
                onClick={copyInviteCode}
                className="text-xs text-gray-400 hover:text-white dark:hover:text-gray-900 transition-colors px-2 py-1 rounded-lg hover:bg-white/10 dark:hover:bg-gray-200"
              >
                {copied ? "Copié !" : "Copier"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-400 dark:text-gray-600">
                Nom de la classe <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="ex: JS Avancé — Groupe A"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                autoFocus
                className="bg-[#0f0f1a] dark:bg-gray-100 dark:text-gray-900 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {schools.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-400 dark:text-gray-600">
                  École associée <span className="text-gray-500">(optionnel)</span>
                </label>
                <select
                  value={selectedSchoolId}
                  onChange={(e) => setSelectedSchoolId(e.target.value)}
                  className="bg-[#0f0f1a] dark:bg-gray-100 dark:text-gray-900 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
                >
                  <option value="">Classe personnelle</option>
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            )}

            {formError && (
              <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{formError}</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
