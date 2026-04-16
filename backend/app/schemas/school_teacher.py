from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class InviteTeacherRequest(BaseModel):
    teacher_email: str


class SchoolTeacherResponse(BaseModel):
    id: UUID
    school_id: UUID
    teacher_id: UUID
    status: str
    invited_at: datetime
    joined_at: datetime | None


class TeacherInSchoolResponse(BaseModel):
    id: UUID  # school_teachers.id — used for suspend/remove
    email: str
    name: str
    status: str
    classes: int = 0
