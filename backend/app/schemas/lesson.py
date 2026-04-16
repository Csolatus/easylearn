from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class LessonCreate(BaseModel):
    title: str
    docs: str | None = None
    ordre: int


class LessonUpdate(BaseModel):
    title: str | None = None
    docs: str | None = None
    ordre: int | None = None


class LessonResponse(BaseModel):
    id: UUID
    course_id: UUID
    title: str
    docs: str | None
    ordre: int
    updated_at: datetime
