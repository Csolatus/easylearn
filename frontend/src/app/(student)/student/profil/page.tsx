"use client";

import { useEffect, useState } from "react";
import { BookOpen, CheckCircle, FileText, Globe } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import ProfileCard from "./ProfileCard";
import ProfileStatsCards from "./ProfileStatsCards";
import ProfileCourseList from "./ProfileCourseList";

const API = process.env.NEXT_PUBLIC_API_URL;

type Course = { id: string; title: string };
type CourseProgress = { course_id: string; total_lessons: number; completed_lessons: number; percentage: number };
type EnrolledCourse = Course & CourseProgress;

export default function StudentProfilPage() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const [enrolled, setEnrolled] = useState<EnrolledCourse[]>([]);
  const [allCount, setAllCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const headers: HeadersInit = { Authorization: `Bearer ${token}` };
    fetch(`${API}/courses`, { headers })
      .then((r) => r.json())
      .then(async (courses: Course[]) => {
        setAllCount(courses.length);
        const progressResults = await Promise.all(
          courses.map((c) => fetch(`${API}/courses/${c.id}/progress/me`, { headers }).then((r) => (r.ok ? r.json() : null)).catch(() => null))
        );
        const active: EnrolledCourse[] = [];
        courses.forEach((c, i) => { const p = progressResults[i]; if (p && p.completed_lessons > 0) active.push({ ...c, ...p }); });
        setEnrolled(active);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [token]);

  const finished = enrolled.filter((c) => c.percentage === 100).length;
  const totalCompleted = enrolled.reduce((sum, c) => sum + c.completed_lessons, 0);
  const displayName = user?.email ? user.email.split("@")[0] : "Étudiant";
  const initial = displayName[0]?.toUpperCase() ?? "E";

  const stats = [
    { label: "Cours suivis", value: isLoading ? "…" : String(enrolled.length), icon: <BookOpen size={20} />, bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400" },
    { label: "Cours complétés", value: isLoading ? "…" : String(finished), icon: <CheckCircle size={20} />, bg: "bg-green-500/10", border: "border-green-500/20", text: "text-green-400" },
    { label: "Leçons complétées", value: isLoading ? "…" : String(totalCompleted), icon: <FileText size={20} />, bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400" },
    { label: "Cours disponibles", value: isLoading ? "…" : String(allCount), icon: <Globe size={20} />, bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-400" },
  ];

  return (
    <div className="px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white dark:text-gray-900">Mon Profil</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Gérez vos informations personnelles</p>
      </div>
      <ProfileCard displayName={displayName} email={user?.email ?? ""} initial={initial} />
      <ProfileStatsCards stats={stats} />
      <ProfileCourseList courses={enrolled} isLoading={isLoading} />
    </div>
  );
}
