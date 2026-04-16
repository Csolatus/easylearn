"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Modal } from "@/components/ui/Modal";
import type { School } from "@/types/api";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function EcolesPage() {
  const token = useAuthStore((s) => s.token);
  const [schools, setSchools] = useState<School[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Suspend
  const [suspending, setSuspending] = useState<string | null>(null);

  function fetchSchools() {
    if (!token) return;
    setIsLoading(true);
    fetch(`${API}/schools`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : [])
      .then((data: School[]) => setSchools(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }

  useEffect(() => { fetchSchools(); }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleCreate() {
    if (!newName.trim()) { setCreateError("Le nom est requis."); return; }
    setCreateError(null);
    setCreating(true);
    try {
      const res = await fetch(`${API}/schools`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setCreateError(data.detail ?? "Erreur lors de la création.");
        return;
      }
      const created: School = await res.json();
      setSchools((prev) => [created, ...prev]);
      setShowCreate(false);
      setNewName("");
    } catch {
      setCreateError("Impossible de joindre le serveur.");
    } finally {
      setCreating(false);
    }
  }

  async function handleSuspend(school: School) {
    setSuspending(school.id);
    try {
      const res = await fetch(`${API}/schools/${school.id}/suspend`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSchools((prev) =>
          prev.map((s) => (s.id === school.id ? { ...s, is_active: false } : s))
        );
      }
    } finally {
      setSuspending(null);
    }
  }

  const filtered = schools.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f0f1a] dark:bg-gray-50 px-8 py-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white dark:text-gray-900">Écoles</h1>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              {isLoading ? "Chargement…" : `${schools.length} établissement${schools.length > 1 ? "s" : ""} enregistré${schools.length > 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={() => { setShowCreate(true); setNewName(""); setCreateError(null); }}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            + Nouvelle école
          </button>
        </div>

        <div className="relative w-full max-w-sm">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a2e] dark:bg-white dark:text-gray-900 dark:shadow-sm text-white placeholder-gray-500 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && (
          <div className="rounded-2xl border border-white/10 dark:border-gray-300 bg-[#111118] dark:bg-white shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 dark:border-gray-200 bg-white/5 dark:bg-gray-50 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white dark:text-gray-900">
                {filtered.length} école{filtered.length > 1 ? "s" : ""}
              </h2>
            </div>

            {filtered.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-gray-500">Aucune école trouvée.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 dark:border-gray-200">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">École</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Créée le</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 dark:divide-gray-200">
                    {filtered.map((school) => (
                      <tr key={school.id} className="hover:bg-white/5 dark:hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-red-600/20 flex items-center justify-center text-sm shrink-0">🏛️</div>
                            <div>
                              <p className="font-medium text-white dark:text-gray-900">{school.name}</p>
                              {school.email && (
                                <p className="text-xs text-gray-500 mt-0.5">{school.email}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400 dark:text-gray-500">
                          {school.created_at ? new Date(school.created_at).toLocaleDateString("fr-FR") : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            school.is_active
                              ? "bg-green-500/10 text-green-400 dark:text-green-600"
                              : "bg-red-500/10 text-red-400 dark:text-red-600"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${school.is_active ? "bg-green-400" : "bg-red-400"}`} />
                            {school.is_active ? "Active" : "Suspendue"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {school.is_active && (
                            <button
                              onClick={() => handleSuspend(school)}
                              disabled={suspending === school.id}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {suspending === school.id ? "…" : "Suspendre"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Nouvelle école"
        size="sm"
        footer={
          <div className="flex gap-3 w-full">
            <button
              onClick={() => setShowCreate(false)}
              className="flex-1 bg-white/5 hover:bg-white/10 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
            >
              {creating ? "Création..." : "Créer l'école"}
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400 dark:text-gray-600">
              Nom de l&apos;école <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="ex: École Nationale du Numérique"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              autoFocus
              className="bg-[#0f0f1a] dark:bg-gray-100 dark:text-gray-900 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          {createError && (
            <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{createError}</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
