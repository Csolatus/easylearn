from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class SchoolCreate(BaseModel):
    name: str


class SchoolUpdate(BaseModel):
    name: str


class SchoolResponse(BaseModel):
    id: UUID
    name: str
    is_active: bool
    created_at: datetime
