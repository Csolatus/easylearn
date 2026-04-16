from uuid import UUID

from pydantic import BaseModel


class CourseAnalytics(BaseModel):
    course_id: UUID
    title: str
    total_lessons: int
    completed_lessons: int
    unique_students: int
    avg_quiz_score_pct: float


class TeacherAnalyticsResponse(BaseModel):
    teacher_id: UUID
    total_courses: int
    total_lessons: int
    avg_lesson_completion_pct: float
    avg_quiz_score_pct: float
    courses: list[CourseAnalytics]


class SchoolAnalyticsResponse(BaseModel):
    school_id: UUID
    total_courses: int
    total_teachers: int
    total_classrooms: int
    avg_lesson_completion_pct: float
    avg_quiz_score_pct: float
