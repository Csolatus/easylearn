from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class CourseCreate(BaseModel):
    title: str
    visibility: str = "private"

    def model_post_init(self, __context):
        if self.visibility not in ("public", "school", "private"):
            raise ValueError("visibility doit être public, school ou private")


class CourseUpdate(BaseModel):
    title: str | None = None
    visibility: str | None = None

    def model_post_init(self, __context):
        if self.visibility and self.visibility not in ("public", "school", "private"):
            raise ValueError("visibility doit être public, school ou private")


class CourseResponse(BaseModel):
    id: UUID
    title: str
    created_by: UUID
    visibility: str
    created_at: datetime
    updated_at: datetime
