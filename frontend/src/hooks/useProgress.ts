"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { CourseProgressResponse, LessonProgressResponse } from "@/types/api";

export function useProgress(courseId: string) {
  const [progress, setProgress] = useState<CourseProgressResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.progress.getCourseProgress(courseId);
      setProgress(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => { fetchProgress(); }, [fetchProgress]);

  const markComplete = useCallback(async (lessonId: string): Promise<LessonProgressResponse> => {
    const result = await api.progress.markComplete(lessonId);
    await fetchProgress();
    return result;
  }, [fetchProgress]);

  const isLessonCompleted = useCallback(
    (lessonId: string): boolean =>
      progress?.lessons.some((l) => l.lesson_id === lessonId && l.completed) ?? false,
    [progress]
  );

  return { progress, loading, error, markComplete, isLessonCompleted, refresh: fetchProgress };
}
