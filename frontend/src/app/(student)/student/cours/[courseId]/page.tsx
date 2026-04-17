"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Spinner from "@/components/ui/Spinner";
import CourseOverviewHeader from "./CourseOverviewHeader";
import LessonList from "./LessonList";

const API = process.env.NEXT_PUBLIC_API_URL;

type BackendLesson = { id: string; title: string; ordre: number; docs: string | null };
type BackendCourse = { id: string; title: string; visibility: string };
type LessonProgress = { lesson_id: string; completed: boolean };

export default function CourseOverviewPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
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

  // Redirect directly to the first incomplete lesson (or first lesson) so
  // clicking a course from the catalogue lands on the theory content in one step.
  const firstIncompleteId = lessons.find((l) => !completedIds.has(l.id))?.id ?? lessons[0]?.id;
  useEffect(() => {
    if (!isLoading && firstIncompleteId) {
      router.replace(`/student/cours/${courseId}/${firstIncompleteId}`);
    }
  }, [isLoading, firstIncompleteId, courseId, router]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-65px)] items-center justify-center bg-background">
        <Spinner color="border-purple-500" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex h-[calc(100vh-65px)] items-center justify-center bg-background">
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
    <div className="min-h-screen bg-background px-8 py-10">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        <Link href="/student/catalogue" className="text-xs text-gray-400 hover:text-foreground transition-colors w-fit">
          ← Retour au catalogue
        </Link>
        <CourseOverviewHeader
          courseId={courseId}
          title={course.title}
          visibility={course.visibility}
          doneCount={doneCount}
          totalCount={lessons.length}
          progress={progress}
          resumeLessonId={resumeLesson?.id ?? null}
        />
        <LessonList courseId={courseId} lessons={lessons} completedIds={completedIds} />
      </div>
    </div>
  );
}
