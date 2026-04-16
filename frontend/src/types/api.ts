// Auth
export type TokenResponse = {
  access_token: string;
  token_type: string;
};

// School
export type School = {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
};

// Course
export type Course = {
  id: string;
  title: string;
  created_by: string;
  visibility: "public" | "school" | "private";
  created_at: string;
  updated_at: string;
};

// Lesson
export type Lesson = {
  id: string;
  course_id: string;
  title: string;
  docs: string | null;
  ordre: number;
  updated_at: string;
};

// Quiz
export type Choice = {
  id: string;
  text: string;
  is_correct: boolean | null;
};

export type Question = {
  id: string;
  statement: string;
  ordre: number;
  choices: Choice[];
};

export type Quiz = {
  id: string;
  lesson_id: string;
  questions: Question[];
};

export type QuizResult = {
  id: string;
  quiz_id: string;
  score: number;
  submitted_at: string;
};

// Progress
export type LessonProgress = {
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
};

export type CourseProgress = {
  course_id: string;
  total_lessons: number;
  completed_lessons: number;
  percentage: number;
  lessons: LessonProgress[];
};

// Classroom
export type Classroom = {
  id: string;
  name: string;
  school_id: string | null;
  invite_code: string;
  is_archived: boolean;
  created_at: string;
};

// Analytics
export type CourseAnalytics = {
  course_id: string;
  title: string;
  total_lessons: number;
  completed_lessons: number;
  unique_students: number;
  avg_quiz_score_pct: number;
};

export type TeacherAnalytics = {
  teacher_id: string;
  total_courses: number;
  total_lessons: number;
  avg_lesson_completion_pct: number;
  avg_quiz_score_pct: number;
  courses: CourseAnalytics[];
};

export type SchoolAnalytics = {
  school_id: string;
  total_courses: number;
  total_teachers: number;
  total_classrooms: number;
  avg_lesson_completion_pct: number;
  avg_quiz_score_pct: number;
};
