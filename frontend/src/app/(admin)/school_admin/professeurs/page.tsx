"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useAuthStore } from "@/store/authStore";
import { useSchoolStore } from "@/store/schoolStore";

type TeacherStatus = "active" | "invited" | "suspended";

type Teacher = {
  id: string;
  name: string;
  email: string;
  classes: number;
  status: TeacherStatus;
};

const MOCK_TEACHERS: Teacher[] = [
  { id: "1", name: "Sophie Bernard", email: "sophie.bernard@ecole.fr", classes: 3, status: "active" },
  { id: "2", name: "Marc Dupont", email: "marc.dupont@ecole.fr", classes: 1, status: "active" },
  { id: "3", name: "Isabelle Moreau", email: "isabelle.moreau@ecole.fr", classes: 0, status: "invited" },
  { id: "4", name: "Julien Faure", email: "julien.faure@ecole.fr", classes: 2, status: "suspended" },
];

const STATUS_FILTERS = ["Tous", "Actif", "Invité", "Suspendu"] as const;
type FilterLabel = (typeof STATUS_FILTERS)[number];

const STATUS_MAP: Record<FilterLabel, TeacherStatus | null> = {
  Tous: null,
  Actif: "active",
  Invité: "invited",
  Suspendu: "suspended",
};

const STATUS_LABELS: Record<TeacherStatus, string> = {
  active: "Actif",
  invited: "Invité",
  suspended: "Suspendu",
};

const STATUS_COLORS: Record<TeacherStatus, string> = {
  active: "bg-green-500/10 text-green-400 dark:text-green-600",
  invited: "bg-yellow-500/10 text-yellow-400 dark:text-yellow-600",
  suspended: "bg-red-500/10 text-red-400 dark:text-red-600",
};

const STATUS_DOT: Record<TeacherStatus, string> = {
  active: "bg-green-400",
  invited: "bg-yellow-400",
  suspended: "bg-red-400",
};

export default function ProfesseursPage() {
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterLabel>("Tous");

  // Invite modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  // Action loading state per teacher
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const token = useAuthStore((s) => s.token);
  const activeSchool = useSchoolStore((s) => s.activeSchool);

  const exportCSV = () => {
    const headers = ["Nom", "Email", "Classes", "Statut"];
    const rows = filtered.map((t) => [t.name, t.email, t.classes, STATUS_LABELS[t.status]]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "professeurs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = teachers.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase());
    const filterStatus = STATUS_MAP[activeFilter];
    const matchFilter = filterStatus === null || t.status === filterStatus;
    return matchSearch && matchFilter;
  });

  function openInviteModal() {
    setInviteEmail("");
    setInviteError(null);
    setInviteSuccess(false);
    setShowInviteModal(true);
  }

  async function handleInvite() {
    if (!inviteEmail.trim() || !/\S+@\S+\.\S+/.test(inviteEmail)) {
      setInviteError("Adresse email invalide.");
      return;
    }
    if (!activeSchool) {
      setInviteError("Aucune école sélectionnée.");
      return;
    }
    setInviteError(null);
    setInviting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/schools/${activeSchool.id}/invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ teacher_email: inviteEmail.trim() }),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setInviteError(data.detail ?? "Erreur lors de l'invitation.");
        return;
      }
      setInviteSuccess(true);
      setTeachers((prev) => [
        {
          id: crypto.randomUUID(),
          name: inviteEmail.split("@")[0],
          email: inviteEmail.trim(),
          classes: 0,
          status: "invited",
        },
        ...prev,
      ]);
    } catch {
      setInviteError("Impossible de joindre le serveur.");
    } finally {
      setInviting(false);
    }
  }

  async function handleSuspend(teacher: Teacher) {
    setActionLoading(teacher.id);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/school-teachers/${teacher.id}/suspend`,
        {
          method: "PATCH",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (res.ok) {
        setTeachers((prev) =>
          prev.map((t) => (t.id === teacher.id ? { ...t, status: "suspended" } : t))
        );
      }
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRemove(teacher: Teacher) {
    setActionLoading(teacher.id);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/school-teachers/${teacher.id}/remove`,
        {
          method: "PATCH",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (res.ok) {
        setTeachers((prev) => prev.filter((t) => t.id !== teacher.id));
      }
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="px-6 py-8 space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white dark:text-gray-900">Professeurs</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Gérez les professeurs de votre école
          </p>
        </div>
        <button
          onClick={openInviteModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-orange-600 hover:bg-orange-700 text-white transition-colors"
        >
          + Inviter un professeur
        </button>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Rechercher un professeur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111118] dark:bg-white border-2 border-white/10 dark:border-gray-400 text-white dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-400 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-md"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? "bg-orange-600 text-white"
                  : "bg-white/5 dark:bg-gray-100 text-gray-400 dark:text-gray-600 hover:bg-white/10 dark:hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 dark:border-gray-300 bg-[#111118] dark:bg-white shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 dark:border-gray-200 bg-white/5 dark:bg-gray-50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white dark:text-gray-900">
            {filtered.length} professeur{filtered.length > 1 ? "s" : ""}
          </h2>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white transition-colors"
          >
            📥 Exporter CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 dark:border-gray-200">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Professeur</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Classes</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 dark:divide-gray-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                    Aucun professeur trouvé.
                  </td>
                </tr>
              ) : (
                filtered.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-white/5 dark:hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-600/20 flex items-center justify-center text-sm font-bold text-orange-400">
                          {teacher.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white dark:text-gray-900">{teacher.name}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{teacher.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300 dark:text-gray-700 font-medium">
                      {teacher.classes}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[teacher.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[teacher.status]}`} />
                        {STATUS_LABELS[teacher.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {teacher.status === "active" && (
                          <button
                            onClick={() => handleSuspend(teacher)}
                            disabled={actionLoading === teacher.id}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Suspendre
                          </button>
                        )}
                        <button
                          onClick={() => handleRemove(teacher)}
                          disabled={actionLoading === teacher.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Retirer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal invitation */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title={inviteSuccess ? "Invitation envoyée !" : "Inviter un professeur"}
        size="sm"
        footer={
          inviteSuccess ? (
            <button
              onClick={() => setShowInviteModal(false)}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
            >
              Fermer
            </button>
          ) : (
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleInvite}
                disabled={inviting}
                className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                {inviting ? "Envoi..." : "Envoyer l'invitation"}
              </button>
            </div>
          )
        }
      >
        {inviteSuccess ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Une invitation a été envoyée à <span className="text-white dark:text-gray-900 font-medium">{inviteEmail}</span>.
            Le professeur apparaîtra dans la liste avec le statut <span className="text-yellow-400 font-medium">Invité</span> jusqu&apos;à acceptation.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Le professeur recevra une invitation par email pour rejoindre votre école.
            </p>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-400 dark:text-gray-600">
                Adresse email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                placeholder="prof@exemple.fr"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                autoFocus
                className="bg-[#0f0f1a] dark:bg-gray-100 dark:text-gray-900 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            {inviteError && (
              <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{inviteError}</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
