"use client";

import { useEffect, useState } from "react";
import { School, BookOpen, FileText, Target } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import TeacherStatsRow from "./TeacherStatsRow";
import TeacherCoursesPanel from "./TeacherCoursesPanel";
import TeacherClassesPanel from "./TeacherClassesPanel";
import CourseCompletionChart from "./CourseCompletionChart";

const API = process.env.NEXT_PUBLIC_API_URL;

type CourseAnalytics = { course_id: string; title: string; total_lessons: number; completed_lessons: number; unique_students: number; avg_quiz_score_pct: number };
type TeacherAnalytics = { total_courses: number; total_lessons: number; avg_lesson_completion_pct: number; avg_quiz_score_pct: number; courses: CourseAnalytics[] };
type Classroom = { id: string; name: string; is_archived: boolean; invite_code: string };

export default function TeacherDashboard() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const [analytics, setAnalytics] = useState<TeacherAnalytics | null>(null);
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const headers: HeadersInit = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API}/analytics/teachers/me`, { headers }).then((r) => r.ok ? r.json() : null),
      fetch(`${API}/classrooms`, { headers }).then((r) => r.ok ? r.json() : []),
    ])
      .then(([analyticsData, classroomsData]) => { setAnalytics(analyticsData); setClasses(classroomsData ?? []); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [token]);

  const activeClasses = classes.filter((c) => !c.is_archived);
  const stats = [
    { label: "Classes actives", value: isLoading ? "…" : String(activeClasses.length), icon: <School size={24} />, color: "from-green-600 to-green-400" },
    { label: "Cours créés", value: isLoading ? "…" : String(analytics?.total_courses ?? 0), icon: <BookOpen size={24} />, color: "from-teal-600 to-teal-400" },
    { label: "Leçons créées", value: isLoading ? "…" : String(analytics?.total_lessons ?? 0), icon: <FileText size={24} />, color: "from-emerald-600 to-emerald-400" },
    { label: "Score quiz moyen", value: isLoading ? "…" : `${Math.round(analytics?.avg_quiz_score_pct ?? 0)}%`, icon: <Target size={24} />, color: "from-cyan-600 to-cyan-400" },
  ];

  return (
    <div className="min-h-screen bg-background px-8 py-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Bonjour{user?.email ? `, ${user.email.split("@")[0]}` : ""}
          </h1>
          <p className="text-muted text-sm mt-1">Vue d&apos;ensemble de vos cours et classes.</p>
        </div>
        <TeacherStatsRow stats={stats} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TeacherCoursesPanel courses={analytics?.courses ?? null} isLoading={isLoading} />
          <TeacherClassesPanel classes={classes} isLoading={isLoading} />
        </div>
        {!isLoading && analytics && analytics.courses.length > 0 && (
          <CourseCompletionChart courses={analytics.courses} />
        )}
      </div>
    </div>
  );
}
