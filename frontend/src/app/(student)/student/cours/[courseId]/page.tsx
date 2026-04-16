"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const API = process.env.NEXT_PUBLIC_API_URL;

type BackendLesson = {
  id: string;
  title: string;
  ordre: number;
  docs: string | null;
};

type BackendCourse = {
  id: string;
  title: string;
  visibility: string;
};

type LessonProgress = {
  lesson_id: string;
  completed: boolean;
};

export default function CourseOverviewPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const token = useAuthStore((s) => s.token);

  const [course, setCourse] = useState<BackendCourse | null>(null);
  const [lessons, setLessons] = useState<BackendLesson[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

    Promise.all([
      fetch(`${API}/courses/${courseId}`, { headers }),
      fetch(`${API}/courses/${courseId}/lessons`, { headers }),
      fetch(`${API}/courses/${courseId}/progress/me`, { headers }),
    ])
      .then(async ([courseRes, lessonsRes, progressRes]) => {
        if (!courseRes.ok) throw new Error("Cours introuvable");
        if (!lessonsRes.ok) throw new Error("Impossible de charger les leçons");

        const [courseData, lessonsData]: [BackendCourse, BackendLesson[]] = await Promise.all([
          courseRes.json(),
          lessonsRes.json(),
        ]);
        lessonsData.sort((a, b) => a.ordre - b.ordre);

        const completed = new Set<string>();
        if (progressRes.ok) {
          const progressData = await progressRes.json();
          for (const lp of progressData.lessons as LessonProgress[]) {
            if (lp.completed) completed.add(lp.lesson_id);
          }
        }

        setCourse(courseData);
        setLessons(lessonsData);
        setCompletedIds(completed);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [courseId, token]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-65px)] items-center justify-center bg-[#0a0a0f]">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex h-[calc(100vh-65px)] items-center justify-center bg-[#0a0a0f]">
        <div className="flex flex-col items-center gap-3">
          <p className="text-red-400 text-sm">{error ?? "Cours introuvable"}</p>
          <Link href="/student/catalogue" className="text-xs text-indigo-400 hover:text-indigo-300">
            ← Retour au catalogue
          </Link>
        </div>
      </div>
    );
  }

  const doneCount = lessons.filter((l) => completedIds.has(l.id)).length;
  const progress = lessons.length > 0 ? Math.round((doneCount / lessons.length) * 100) : 0;
  const firstIncomplete = lessons.find((l) => !completedIds.has(l.id));
  const resumeLesson = firstIncomplete ?? lessons[0];

  return (
    <div className="min-h-screen bg-[#0f0f1a] dark:bg-gray-50 px-8 py-10">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        {/* Back */}
        <Link
          href="/student/catalogue"
          className="text-xs text-gray-400 hover:text-white dark:hover:text-gray-900 transition-colors w-fit"
        >
          ← Retour au catalogue
        </Link>

        {/* Course header */}
        <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white dark:text-gray-900">{course.title}</h1>
              <span className={`mt-2 inline-block text-xs font-bold px-2 py-0.5 rounded-full ${
                course.visibility === "public"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-blue-500/20 text-blue-400"
              }`}>
                {course.visibility}
              </span>
            </div>
            {resumeLesson && (
              <Link
                href={`/student/cours/${courseId}/${resumeLesson.id}`}
                className="shrink-0 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors"
              >
                {doneCount === 0 ? "Commencer →" : doneCount === lessons.length ? "✓ Terminé" : "Continuer →"}
              </Link>
            )}
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span>Progression</span>
              <span>{doneCount}/{lessons.length} leçons · {progress}%</span>
            </div>
            <div className="h-2 bg-white/10 dark:bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${progress === 100 ? "bg-green-500" : "bg-purple-500"}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Lessons list */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Leçons ({lessons.length})
          </h2>
          {lessons.length === 0 && (
            <p className="text-gray-500 text-sm py-4 text-center">Aucune leçon pour ce cours.</p>
          )}
          {lessons.map((lesson, idx) => {
            const done = completedIds.has(lesson.id);
            return (
              <Link
                key={lesson.id}
                href={`/student/cours/${courseId}/${lesson.id}`}
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-[#1a1a2e] dark:bg-white dark:shadow-sm hover:bg-white/10 dark:hover:bg-gray-50 transition-colors"
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  done
                    ? "bg-green-500/20 text-green-400"
                    : "bg-white/10 dark:bg-gray-200 text-gray-400"
                }`}>
                  {done ? "✓" : idx + 1}
                </span>
                <span className="text-sm text-white dark:text-gray-900 flex-1">{lesson.title}</span>
                <span className="text-gray-600 dark:text-gray-400 text-xs">→</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
