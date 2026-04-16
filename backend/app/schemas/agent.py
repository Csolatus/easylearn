from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel


class ConversationRequest(BaseModel):
    student_id: UUID


class ConversationResponse(BaseModel):
    conversation_id: UUID


class ChatRequest(BaseModel):
    student_id: UUID
    message: str


class ChatResponse(BaseModel):
    response: str
    conversation_id: UUID


class ExchangeResponse(BaseModel):
    id: UUID
    prompt: str
    output: str | None
    created_at: datetime


class ExerciseInstructionsResponse(BaseModel):
    exercise_id: UUID
    instructions: str


class HealthResponse(BaseModel):
    status: Literal["ok", "unavailable"]
    model: str
