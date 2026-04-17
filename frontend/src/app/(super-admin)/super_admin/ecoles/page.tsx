"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { EcolesTable } from "./EcolesTable";
import { CreateSchoolModal } from "./CreateSchoolModal";
import { Search } from "lucide-react";
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
    <div className="min-h-screen bg-background px-8 py-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Écoles</h1>
            <p className="text-muted text-sm mt-1">
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
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none"><Search size={14} /></span>
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface dark:shadow-sm text-white placeholder-gray-500 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && (
          <EcolesTable
            filtered={filtered}
            suspending={suspending}
            onSuspend={handleSuspend}
          />
        )}
      </div>

      <CreateSchoolModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        newName={newName}
        onNameChange={setNewName}
        onCreate={handleCreate}
        creating={creating}
        createError={createError}
      />
    </div>
  );
}
