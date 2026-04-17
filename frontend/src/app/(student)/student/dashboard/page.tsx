"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { students } from "@/lib/api";
import type { ActivityItem } from "@/types/api";
import StudentStatsCards from "./StudentStatsCards";
import StudentCourseProgress from "./StudentCourseProgress";
import RecentActivity from "./RecentActivity";

const API = process.env.NEXT_PUBLIC_API_URL;

type Course = { id: string; title: string };
type CourseProgress = { course_id: string; total_lessons: number; completed_lessons: number; percentage: number };
type EnrolledCourse = Course & CourseProgress;

export default function StudentDashboard() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const [enrolled, setEnrolled] = useState<EnrolledCourse[]>([]);
  const [allCount, setAllCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

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
    students.activity().then(setActivity).catch(() => {});
  }, [token]);

  const totalCompleted = enrolled.reduce((sum, c) => sum + c.completed_lessons, 0);
  const inProgress = enrolled.filter((c) => c.percentage < 100).length;
  const finished = enrolled.filter((c) => c.percentage === 100).length;

  const stats = [
    { label: "Cours en cours", value: isLoading ? "…" : String(inProgress), color: "text-purple-400" },
    { label: "Leçons complétées", value: isLoading ? "…" : String(totalCompleted), color: "text-emerald-400" },
    { label: "Cours terminés", value: isLoading ? "…" : String(finished), color: "text-yellow-400" },
    { label: "Cours disponibles", value: isLoading ? "…" : String(allCount), color: "text-pink-400" },
  ];

  return (
    <div className="min-h-screen bg-background px-8 py-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Bonjour{user?.email ? `, ${user.email.split("@")[0]}` : ""} 👋
          </h1>
          <p className="text-muted text-sm mt-1">Continuez là où vous en étiez.</p>
        </div>
        <StudentStatsCards stats={stats} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StudentCourseProgress courses={enrolled} isLoading={isLoading} />
          <RecentActivity activity={activity} />
        </div>
      </div>
    </div>
  );
}
