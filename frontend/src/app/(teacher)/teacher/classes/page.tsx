"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useSchoolStore } from "@/store/schoolStore";
import SearchInput from "@/components/ui/SearchInput";
import Spinner from "@/components/ui/Spinner";
import ClassCard from "./ClassCard";
import CreateClassModal from "./CreateClassModal";

const API = process.env.NEXT_PUBLIC_API_URL;

type Classroom = { id: string; name: string; school_id: string | null; invite_code: string; is_archived: boolean; created_at: string };

export default function ClassesPage() {
  const token = useAuthStore((s) => s.token);
  const schools = useSchoolStore((s) => s.schools);

  const [classes, setClasses] = useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [className, setClassName] = useState("");
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
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
    setClassName(""); setSelectedSchoolId(""); setFormError(null); setCreatedInviteCode(null); setCopied(false); setShowModal(true);
  }

  async function handleCreate() {
    if (!className.trim()) { setFormError("Le nom de la classe est requis."); return; }
    setFormError(null); setSubmitting(true);
    try {
      const body: { name: string; school_id?: string } = { name: className.trim() };
      if (selectedSchoolId) body.school_id = selectedSchoolId;
      const res = await fetch(`${API}/classrooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(body),
      });
      if (!res.ok) { const data = await res.json().catch(() => ({})); setFormError(data.detail ?? "Erreur lors de la création."); return; }
      const created: Classroom = await res.json();
      setCreatedInviteCode(created.invite_code);
      setClasses((prev) => [created, ...prev]);
    } catch { setFormError("Impossible de joindre le serveur."); }
    finally { setSubmitting(false); }
  }

  async function copyInviteCode() {
    if (!createdInviteCode) return;
    await navigator.clipboard.writeText(createdInviteCode);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  const filtered = classes.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0f0f1a] dark:bg-gray-50 px-8 py-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white dark:text-gray-900">Mes classes</h1>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              {isLoading ? "Chargement…" : `${classes.length} classe${classes.length > 1 ? "s" : ""}`}
            </p>
          </div>
          <button onClick={openModal} className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
            + Nouvelle classe
          </button>
        </div>

        <div className="max-w-sm">
          <SearchInput value={search} onChange={setSearch} placeholder="Rechercher une classe..." />
        </div>

        <div className="flex flex-col gap-4">
          {isLoading && <div className="flex justify-center py-16"><Spinner color="border-green-500" /></div>}
          {!isLoading && filtered.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-16">
              {classes.length === 0 ? "Aucune classe. Créez-en une !" : "Aucune classe trouvée."}
            </p>
          )}
          {!isLoading && filtered.map((cls) => <ClassCard key={cls.id} classroom={cls} schools={schools} />)}
        </div>
      </div>

      <CreateClassModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setCreatedInviteCode(null); }}
        createdInviteCode={createdInviteCode}
        className={className}
        selectedSchoolId={selectedSchoolId}
        formError={formError}
        submitting={submitting}
        copied={copied}
        schools={schools}
        onClassNameChange={setClassName}
        onSchoolChange={setSelectedSchoolId}
        onCreate={handleCreate}
        onCopyCode={copyInviteCode}
      />
    </div>
  );
}
