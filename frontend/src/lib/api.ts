import { useAuthStore } from "@/store/authStore";
import type {
  TokenResponse,
  UserResponse,
  CourseResponse,
  CourseCreate,
  CourseUpdate,
  LessonResponse,
  LessonCreate,
  LessonUpdate,
  ClassroomResponse,
  ClassroomCreate,
  ClassroomUpdate,
  SchoolResponse,
  SchoolCreate,
  SchoolUpdate,
  SchoolTeacherResponse,
  QuizResponse,
  QuizSubmit,
  QuizResultResponse,
  LessonProgressResponse,
  CourseProgressResponse,
  TeacherAnalyticsResponse,
  SchoolAnalyticsResponse,
  ActivityItem,
  ConversationResponse,
  ChatResponse,
  ExchangeResponse,
} from "@/types/api";

// ── Error ─────────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ── Core fetch ────────────────────────────────────────────────────────────────

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  schoolId?: string;
};

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, schoolId } = opts;
  const token = useAuthStore.getState().token;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (schoolId) headers["X-School-ID"] = schoolId;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new ApiError(res.status, payload.detail ?? res.statusText);
  }

  return res.json() as Promise<T>;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const auth = {
  register: (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: string;
  }) =>
    request<UserResponse>("/auth/register", { method: "POST", body: data }),

  login: (email: string, password: string) =>
    request<TokenResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
    }),

  me: () => request<UserResponse>("/auth/me"),

  logout: () => request<void>("/auth/logout", { method: "POST" }),
};

// ── Courses ───────────────────────────────────────────────────────────────────

export const courses = {
  list: (schoolId?: string) =>
    request<CourseResponse[]>("/courses", { schoolId }),

  get: (courseId: string) =>
    request<CourseResponse>(`/courses/${courseId}`),

  create: (data: CourseCreate) =>
    request<CourseResponse>("/courses", { method: "POST", body: data }),

  update: (courseId: string, data: CourseUpdate) =>
    request<CourseResponse>(`/courses/${courseId}`, {
      method: "PATCH",
      body: data,
    }),

  delete: (courseId: string) =>
    request<void>(`/courses/${courseId}`, { method: "DELETE" }),

  lessons: {
    list: (courseId: string) =>
      request<LessonResponse[]>(`/courses/${courseId}/lessons`),

    get: (courseId: string, lessonId: string) =>
      request<LessonResponse>(`/courses/${courseId}/lessons/${lessonId}`),

    create: (courseId: string, data: LessonCreate) =>
      request<LessonResponse>(`/courses/${courseId}/lessons`, {
        method: "POST",
        body: data,
      }),

    update: (courseId: string, lessonId: string, data: LessonUpdate) =>
      request<LessonResponse>(`/courses/${courseId}/lessons/${lessonId}`, {
        method: "PATCH",
        body: data,
      }),

    delete: (courseId: string, lessonId: string) =>
      request<void>(`/courses/${courseId}/lessons/${lessonId}`, {
        method: "DELETE",
      }),
  },
};

// ── Classrooms ────────────────────────────────────────────────────────────────

export const classrooms = {
  list: (schoolId?: string) =>
    request<ClassroomResponse[]>(
      schoolId ? `/classrooms?school_id=${schoolId}` : "/classrooms"
    ),

  get: (classroomId: string) =>
    request<ClassroomResponse>(`/classrooms/${classroomId}`),

  create: (data: ClassroomCreate) =>
    request<ClassroomResponse>("/classrooms", { method: "POST", body: data }),

  update: (classroomId: string, data: ClassroomUpdate) =>
    request<ClassroomResponse>(`/classrooms/${classroomId}`, {
      method: "PATCH",
      body: data,
    }),

  archive: (classroomId: string) =>
    request<ClassroomResponse>(`/classrooms/${classroomId}/archive`, {
      method: "PATCH",
    }),

  assignCourse: (classroomId: string, courseId: string) =>
    request<void>(
      `/classrooms/${classroomId}/courses?course_id=${courseId}`,
      { method: "POST" }
    ),

  removeCourse: (classroomId: string, courseId: string) =>
    request<void>(`/classrooms/${classroomId}/courses/${courseId}`, {
      method: "DELETE",
    }),
};

// ── Schools ───────────────────────────────────────────────────────────────────

export const schools = {
  list: () => request<SchoolResponse[]>("/schools"),

  get: (schoolId: string) => request<SchoolResponse>(`/schools/${schoolId}`),

  create: (data: SchoolCreate) =>
    request<SchoolResponse>("/schools", { method: "POST", body: data }),

  update: (schoolId: string, data: SchoolUpdate) =>
    request<SchoolResponse>(`/schools/${schoolId}`, {
      method: "PATCH",
      body: data,
    }),

  suspend: (schoolId: string) =>
    request<SchoolResponse>(`/schools/${schoolId}/suspend`, {
      method: "PATCH",
    }),

  inviteTeacher: (schoolId: string, teacherEmail: string) =>
    request<SchoolTeacherResponse>(`/schools/${schoolId}/invite`, {
      method: "POST",
      body: { teacher_email: teacherEmail },
    }),
};

// ── School teachers ───────────────────────────────────────────────────────────

export const schoolTeachers = {
  myInvitations: () =>
    request<SchoolTeacherResponse[]>("/my-invitations"),

  accept: (invitationId: string) =>
    request<SchoolTeacherResponse>(
      `/school-teachers/${invitationId}/accept`,
      { method: "PATCH" }
    ),

  decline: (invitationId: string) =>
    request<void>(`/school-teachers/${invitationId}/decline`, {
      method: "PATCH",
    }),

  suspend: (invitationId: string) =>
    request<SchoolTeacherResponse>(
      `/school-teachers/${invitationId}/suspend`,
      { method: "PATCH" }
    ),

  remove: (invitationId: string) =>
    request<SchoolTeacherResponse>(
      `/school-teachers/${invitationId}/remove`,
      { method: "PATCH" }
    ),
};

// ── Quiz ──────────────────────────────────────────────────────────────────────

export const quiz = {
  get: (lessonId: string) =>
    request<QuizResponse>(`/lessons/${lessonId}/quiz`),

  submit: (lessonId: string, data: QuizSubmit) =>
    request<QuizResultResponse>(`/lessons/${lessonId}/quiz/submit`, {
      method: "POST",
      body: data,
    }),

  myResults: (lessonId: string) =>
    request<QuizResultResponse[]>(`/lessons/${lessonId}/quiz/results/me`),
};

// ── Progress ──────────────────────────────────────────────────────────────────

export const progress = {
  markComplete: (lessonId: string) =>
    request<LessonProgressResponse>(`/lessons/${lessonId}/complete`, {
      method: "POST",
    }),

  getCourseProgress: (courseId: string) =>
    request<CourseProgressResponse>(`/courses/${courseId}/progress/me`),
};

// ── Analytics ─────────────────────────────────────────────────────────────────

export const analytics = {
  school: (schoolId: string) =>
    request<SchoolAnalyticsResponse>(`/analytics/schools/${schoolId}`),

  teacher: {
    me: () => request<TeacherAnalyticsResponse>("/analytics/teachers/me"),

    get: (teacherId: string) =>
      request<TeacherAnalyticsResponse>(`/analytics/teachers/${teacherId}`),
  },
};

// ── Students ──────────────────────────────────────────────────────────────────

export const students = {
  activity: () => request<ActivityItem[]>("/students/me/activity"),
};

// ── Agent ─────────────────────────────────────────────────────────────────────

export const agent = {
  createConversation: (studentId: string) =>
    request<ConversationResponse>("/agent/conversations", {
      method: "POST",
      body: { student_id: studentId },
    }),

  chat: (conversationId: string, studentId: string, message: string) =>
    request<ChatResponse>(`/agent/conversations/${conversationId}/chat`, {
      method: "POST",
      body: { student_id: studentId, message },
    }),

  messages: (conversationId: string) =>
    request<ExchangeResponse[]>(
      `/agent/conversations/${conversationId}/messages`
    ),
};

// ── Generic HTTP helpers (used by some pages directly) ────────────────────────

export const api = {
  auth,
  courses,
  classrooms,
  schools,
  schoolTeachers,
  quiz,
  progress,
  analytics,
  students,
  agent,

  get: <T>(path: string, opts?: { schoolId?: string }) =>
    request<T>(path, { method: "GET", ...opts }),

  post: <T>(path: string, body?: unknown, opts?: { schoolId?: string }) =>
    request<T>(path, { method: "POST", body, ...opts }),

  patch: <T>(path: string, body?: unknown, opts?: { schoolId?: string }) =>
    request<T>(path, { method: "PATCH", body, ...opts }),

  delete: <T = void>(path: string, opts?: { schoolId?: string }) =>
    request<T>(path, { method: "DELETE", ...opts }),
};
