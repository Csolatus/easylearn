"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Spinner from "@/components/ui/Spinner";
import ClassDetailHeader from "./ClassDetailHeader";
import ClassCoursesTab from "./ClassCoursesTab";
import ClassInfoTab from "./ClassInfoTab";

const API = process.env.NEXT_PUBLIC_API_URL;

type Tab = "cours" | "info";
type Classroom = { id: string; name: string; school_id: string | null; invite_code: string; is_archived: boolean; created_at: string };
type Course = { id: string; title: string; visibility: string };

const TABS: { key: Tab; label: string }[] = [
  { key: "cours", label: "Cours assignés" },
  { key: "info", label: "Informations" },
];

export default function ClassDetailPage() {
  const { classId } = useParams<{ classId: string }>();
  const token = useAuthStore((s) => s.token);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("cours");
  const [toggling, setToggling] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token || !classId) return;
    const headers: HeadersInit = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API}/classrooms/${classId}`, { headers }).then((r) => r.ok ? r.json() : null),
      fetch(`${API}/courses`, { headers }).then((r) => r.ok ? r.json() : []),
    ])
      .then(([cls, courses]) => { setClassroom(cls); setMyCourses(Array.isArray(courses) ? courses : []); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [token, classId]);

  async function toggleCourse(courseId: string) {
    if (toggling) return;
    setToggling(courseId);
    const isAssigned = assignedIds.has(courseId);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = isAssigned
        ? await fetch(`${API}/classrooms/${classId}/courses/${courseId}`, { method: "DELETE", headers })
        : await fetch(`${API}/classrooms/${classId}/courses?course_id=${courseId}`, { method: "POST", headers });
      if (res.ok) setAssignedIds((prev) => { const next = new Set(prev); isAssigned ? next.delete(courseId) : next.add(courseId); return next; });
    } finally { setToggling(null); }
  }

  async function copyCode() {
    if (!classroom?.invite_code) return;
    await navigator.clipboard.writeText(classroom.invite_code);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  if (isLoading) return <div className="flex justify-center py-20"><Spinner color="border-green-500" /></div>;
  if (!classroom) return <div className="min-h-screen bg-[#0f0f1a] dark:bg-gray-50 flex items-center justify-center"><p className="text-gray-400">Classe introuvable.</p></div>;

  return (
    <div className="min-h-screen bg-[#0f0f1a] dark:bg-gray-50 px-8 py-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <ClassDetailHeader classroom={classroom} copied={copied} onCopyCode={copyCode} />

        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === tab.key ? "bg-green-600 text-white" : "bg-white/5 dark:bg-gray-100 text-gray-400 dark:text-gray-600 hover:bg-white/10 dark:hover:bg-gray-200"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "cours" && <ClassCoursesTab courses={myCourses} assignedIds={assignedIds} toggling={toggling} onToggle={toggleCourse} />}
        {activeTab === "info" && <ClassInfoTab classroom={classroom} />}
      </div>
    </div>
  );
}
