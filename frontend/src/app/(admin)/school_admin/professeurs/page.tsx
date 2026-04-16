"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useSchoolStore } from "@/store/schoolStore";
import { ProfesseursToolbar } from "./ProfesseursToolbar";
import { ProfesseursTable } from "./ProfesseursTable";
import { InviteTeacherModal } from "./InviteTeacherModal";

type TeacherStatus = "active" | "invited" | "suspended";

type Teacher = {
  id: string;
  name: string;
  email: string;
  classes: number;
  status: TeacherStatus;
};

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

export default function ProfesseursPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    if (!activeSchool?.id) { setIsLoading(false); return; }
    api.get<Teacher[]>(`/schools/${activeSchool.id}/teachers`)
      .then((data) => setTeachers(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [activeSchool]);

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

      <ProfesseursToolbar
        search={search}
        onSearch={setSearch}
        activeFilter={activeFilter}
        onFilter={setActiveFilter}
      />

      <ProfesseursTable
        filtered={filtered}
        isLoading={isLoading}
        actionLoading={actionLoading}
        onSuspend={handleSuspend}
        onRemove={handleRemove}
        onExport={exportCSV}
      />

      <InviteTeacherModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        inviteEmail={inviteEmail}
        onEmailChange={setInviteEmail}
        onInvite={handleInvite}
        inviting={inviting}
        inviteSuccess={inviteSuccess}
        inviteError={inviteError}
      />
    </div>
  );
}
