"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { useCourseStore } from "@/store/courseStore";
import type { CourseResponse, LessonResponse, CourseCreate, CourseUpdate, LessonCreate, LessonUpdate } from "@/types/api";

export function useCourses(schoolId?: string) {
  const { courses, setCourses } = useCourseStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.courses.list(schoolId);
      setCourses(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, [schoolId, setCourses]);

  useEffect(() => { fetch(); }, [fetch]);

  const createCourse = useCallback(async (data: CourseCreate): Promise<CourseResponse> => {
    const created = await api.courses.create(data);
    setCourses([...useCourseStore.getState().courses, created]);
    return created;
  }, [setCourses]);

  const updateCourse = useCallback(async (courseId: string, data: CourseUpdate): Promise<CourseResponse> => {
    const updated = await api.courses.update(courseId, data);
    setCourses(useCourseStore.getState().courses.map((c) => (c.id === courseId ? updated : c)));
    return updated;
  }, [setCourses]);

  const deleteCourse = useCallback(async (courseId: string): Promise<void> => {
    await api.courses.delete(courseId);
    setCourses(useCourseStore.getState().courses.filter((c) => c.id !== courseId));
  }, [setCourses]);

  return { courses, loading, error, refresh: fetch, createCourse, updateCourse, deleteCourse };
}

export function useCourse(courseId: string) {
  const { currentCourse, lessons, setCurrentCourse, setLessons } = useCourseStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    Promise.all([api.courses.get(courseId), api.courses.lessons.list(courseId)])
      .then(([course, lessonList]) => { setCurrentCourse(course); setLessons(lessonList); })
      .catch((e) => setError(e instanceof Error ? e.message : "Erreur"))
      .finally(() => setLoading(false));
  }, [courseId, setCurrentCourse, setLessons]);

  const createLesson = useCallback(async (data: LessonCreate): Promise<LessonResponse> => {
    const lesson = await api.courses.lessons.create(courseId, data);
    setLessons([...useCourseStore.getState().lessons, lesson].sort((a, b) => a.ordre - b.ordre));
    return lesson;
  }, [courseId, setLessons]);

  const updateLesson = useCallback(async (lessonId: string, data: LessonUpdate): Promise<LessonResponse> => {
    const updated = await api.courses.lessons.update(courseId, lessonId, data);
    setLessons(useCourseStore.getState().lessons.map((l) => (l.id === lessonId ? updated : l)).sort((a, b) => a.ordre - b.ordre));
    return updated;
  }, [courseId, setLessons]);

  const deleteLesson = useCallback(async (lessonId: string): Promise<void> => {
    await api.courses.lessons.delete(courseId, lessonId);
    setLessons(useCourseStore.getState().lessons.filter((l) => l.id !== lessonId));
  }, [courseId, setLessons]);

  return { course: currentCourse, lessons, loading, error, createLesson, updateLesson, deleteLesson };
}
