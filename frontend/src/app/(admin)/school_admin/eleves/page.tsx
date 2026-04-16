"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useSchoolStore } from "@/store/schoolStore";
import { ElevesToolbar } from "./ElevesToolbar";
import { ElevesTable } from "./ElevesTable";

type Student = {
  id: string;
  name: string;
  email: string;
};

export default function ElevesPage() {
  const activeSchool = useSchoolStore((s) => s.activeSchool);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");

  useEffect(() => {
    if (!activeSchool?.id) { setIsLoading(false); return; }
    api.get<Student[]>(`/schools/${activeSchool.id}/students`)
      .then((data) => setStudents(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [activeSchool]);

  const exportCSV = () => {
    const headers = ["Nom", "Email"];
    const rows = filtered.map((s) => [s.name, s.email]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "eleves.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      activeFilter === "Tous" ? true :
      activeFilter === "A-M" ? s.name[0]?.toUpperCase() <= "M" :
      s.name[0]?.toUpperCase() > "M";
    return matchSearch && matchFilter;
  });

  return (
    <div className="px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white dark:text-gray-900">Élèves</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          {isLoading ? "Chargement…" : `${students.length} élève${students.length > 1 ? "s" : ""} actif${students.length > 1 ? "s" : ""}`}
        </p>
      </div>

      <ElevesToolbar
        search={search}
        onSearch={setSearch}
        activeFilter={activeFilter}
        onFilter={setActiveFilter}
      />

      <ElevesTable
        students={students}
        filtered={filtered}
        isLoading={isLoading}
        hasActiveSchool={!!activeSchool}
        onExport={exportCSV}
      />
    </div>
  );
}
