// ── Auth ─────────────────────────────────────────────────────────────────────

export type UserResponse = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "student" | "teacher" | "school_admin" | "super_admin";
};

export type TokenResponse = {
  access_token: string;
  token_type: "bearer";
};

// ── Courses & Lessons ─────────────────────────────────────────────────────────

export type CourseVisibility = "public" | "school" | "private";

export type CourseResponse = {
  id: string;
  title: string;
  created_by: string;
  visibility: CourseVisibility;
  created_at: string;
  updated_at: string;
};

export type CourseCreate = {
  title: string;
  visibility?: CourseVisibility;
};

export type CourseUpdate = {
  title?: string;
  visibility?: CourseVisibility;
};

export type LessonResponse = {
  id: string;
  course_id: string;
  title: string;
  docs: string | null;
  ordre: number;
  updated_at: string;
};

export type LessonCreate = {
  title: string;
  docs?: string | null;
  ordre: number;
};

export type LessonUpdate = {
  title?: string;
  docs?: string | null;
  ordre?: number;
};

// ── Classrooms ────────────────────────────────────────────────────────────────

export type ClassroomResponse = {
  id: string;
  name: string;
  school_id: string | null;
  invite_code: string;
  is_archived: boolean;
  created_at: string;
};

export type ClassroomCreate = {
  name: string;
  school_id?: string | null;
};

export type ClassroomUpdate = {
  name: string;
};

// ── Schools ───────────────────────────────────────────────────────────────────

export type School = {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
};

/** @deprecated use School */
export type SchoolResponse = {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
};

export type SchoolCreate = {
  name: string;
};

export type SchoolUpdate = {
  name: string;
};

// ── School Teachers ───────────────────────────────────────────────────────────

export type TeacherStatus = "invited" | "active" | "suspended" | "removed";

export type SchoolTeacherResponse = {
  id: string;
  school_id: string;
  teacher_id: string;
  status: TeacherStatus;
  invited_at: string;
  joined_at: string | null;
};

// ── Quiz ──────────────────────────────────────────────────────────────────────

export type ChoiceResponse = {
  id: string;
  text: string;
  is_correct: boolean | null;
};

export type QuestionResponse = {
  id: string;
  statement: string;
  ordre: number;
  choices: ChoiceResponse[];
};

export type QuizResponse = {
  id: string;
  lesson_id: string;
  questions: QuestionResponse[];
};

export type AnswerSubmit = {
  question_id: string;
  choice_id: string;
};

export type QuizSubmit = {
  answers: AnswerSubmit[];
};

export type QuizResultResponse = {
  id: string;
  quiz_id: string;
  score: number;
  submitted_at: string;
};

// ── Progress ──────────────────────────────────────────────────────────────────

export type LessonProgressResponse = {
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
};

export type CourseProgressResponse = {
  course_id: string;
  total_lessons: number;
  completed_lessons: number;
  percentage: number;
  lessons: LessonProgressResponse[];
};

// ── Analytics ─────────────────────────────────────────────────────────────────

export type CourseAnalytics = {
  course_id: string;
  title: string;
  total_lessons: number;
  completed_lessons: number;
  unique_students: number;
  avg_quiz_score_pct: number;
};

export type TeacherAnalyticsResponse = {
  teacher_id: string;
  total_courses: number;
  total_lessons: number;
  avg_lesson_completion_pct: number;
  avg_quiz_score_pct: number;
  courses: CourseAnalytics[];
};

export type SchoolAnalyticsResponse = {
  school_id: string;
  total_courses: number;
  total_teachers: number;
  total_classrooms: number;
  avg_lesson_completion_pct: number;
  avg_quiz_score_pct: number;
};

// ── Agent ─────────────────────────────────────────────────────────────────────

export type ConversationResponse = {
  conversation_id: string;
};

export type ChatResponse = {
  response: string;
  conversation_id: string;
};

export type ExchangeResponse = {
  id: string;
  prompt: string;
  output: string | null;
  created_at: string;
};
