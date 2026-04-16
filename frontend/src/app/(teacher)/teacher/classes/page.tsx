"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { useAuthStore } from "@/store/authStore";
import { useSchoolStore } from "@/store/schoolStore";

const API = process.env.NEXT_PUBLIC_API_URL;

type Classroom = {
  id: string;
  name: string;
  school_id: string | null;
  invite_code: string;
  is_archived: boolean;
  created_at: string;
};

export default function ClassesPage() {
  const token = useAuthStore((s) => s.token);
  const schools = useSchoolStore((s) => s.schools);

  const [classes, setClasses] = useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [className, setClassName] = useState("");
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [createdInviteCode, setCreatedInviteCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/classrooms`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : [])
      .then((data: Classroom[]) => setClasses(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [token]);

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
    if (!className.trim()) { setFormError("Le nom de la classe est requis."); return; }
    setFormError(null);
    setSubmitting(true);
    try {
      const body: { name: string; school_id?: string } = { name: className.trim() };
      if (selectedSchoolId) body.school_id = selectedSchoolId;

      const res = await fetch(`${API}/classrooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setFormError(data.detail ?? "Erreur lors de la création.");
        return;
      }

      const created: Classroom = await res.json();
      setCreatedInviteCode(created.invite_code);
      setClasses((prev) => [created, ...prev]);
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
              {isLoading ? "Chargement…" : `${classes.length} classe${classes.length > 1 ? "s" : ""}`}
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

        {/* List */}
        <div className="flex flex-col gap-4">
          {isLoading && (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-16">
              {classes.length === 0 ? "Aucune classe. Créez-en une !" : "Aucune classe trouvée."}
            </p>
          )}

          {!isLoading && filtered.map((cls) => (
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
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-mono">
                      Code : {cls.invite_code}
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
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${!cls.is_archived ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                    {cls.is_archived ? "Archivée" : "Active"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Créée le {new Date(cls.created_at).toLocaleDateString("fr-FR")}
              </p>
            </Link>
          ))}
        </div>

      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={createdInviteCode ? "Classe créée !" : "Nouvelle classe"}
        size="sm"
        footer={
          createdInviteCode ? (
            <button onClick={closeModal} className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
              Fermer
            </button>
          ) : (
            <div className="flex gap-3 w-full">
              <button onClick={closeModal} className="flex-1 bg-white/5 hover:bg-white/10 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
                Annuler
              </button>
              <button onClick={handleCreate} disabled={submitting} className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
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
              <button onClick={copyInviteCode} className="text-xs text-gray-400 hover:text-white dark:hover:text-gray-900 transition-colors px-2 py-1 rounded-lg hover:bg-white/10 dark:hover:bg-gray-200">
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
                  {schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            )}
            {formError && <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{formError}</p>}
          </div>
        )}
      </Modal>
    </div>
  );
}
