from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class ClassroomCreate(BaseModel):
    name: str
    school_id: UUID | None = None


class ClassroomUpdate(BaseModel):
    name: str


class ClassroomResponse(BaseModel):
    id: UUID
    name: str
    school_id: UUID | None
    invite_code: str
    is_archived: bool
    created_at: datetime
