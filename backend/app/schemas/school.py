from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class SchoolCreate(BaseModel):
    name: str
    email: str | None = None
    website: str | None = None
    address: str | None = None


class SchoolUpdate(BaseModel):
    name: str | None = None
    email: str | None = None
    website: str | None = None
    address: str | None = None


class SchoolResponse(BaseModel):
    id: UUID
    name: str
    email: str | None = None
    website: str | None = None
    address: str | None = None
    is_active: bool
    created_at: datetime
