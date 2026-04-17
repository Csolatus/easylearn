from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class ActivityItem(BaseModel):
    type: str  # "lesson_complete" | "quiz_submit"
    lesson_title: str
    course_title: str
    timestamp: datetime


class LessonProgressResponse(BaseModel):
    lesson_id: UUID
    completed: bool
    completed_at: datetime | None = None

    model_config = {"from_attributes": True}


class CourseProgressResponse(BaseModel):
    course_id: UUID
    total_lessons: int
    completed_lessons: int
    percentage: float
    lessons: list[LessonProgressResponse]
