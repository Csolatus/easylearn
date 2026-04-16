import { create } from "zustand";
import type { CourseResponse, LessonResponse } from "@/types/api";

type CourseState = {
  courses: CourseResponse[];
  currentCourse: CourseResponse | null;
  lessons: LessonResponse[];
  setCourses: (courses: CourseResponse[]) => void;
  setCurrentCourse: (course: CourseResponse | null) => void;
  setLessons: (lessons: LessonResponse[]) => void;
  reset: () => void;
};

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  currentCourse: null,
  lessons: [],

  setCourses: (courses) => set({ courses }),
  setCurrentCourse: (course) => set({ currentCourse: course }),
  setLessons: (lessons) => set({ lessons }),
  reset: () => set({ courses: [], currentCourse: null, lessons: [] }),
}));
