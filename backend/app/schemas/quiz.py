from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class ChoiceCreate(BaseModel):
    text: str
    is_correct: bool = False


class ChoiceResponse(BaseModel):
    id: UUID
    text: str
    is_correct: bool | None = None  # None = masqué (vue étudiant)

    model_config = {"from_attributes": True}


class QuestionCreate(BaseModel):
    statement: str
    ordre: int


class QuestionResponse(BaseModel):
    id: UUID
    statement: str
    ordre: int
    choices: list[ChoiceResponse] = []

    model_config = {"from_attributes": True}


class QuizResponse(BaseModel):
    id: UUID
    lesson_id: UUID
    questions: list[QuestionResponse] = []

    model_config = {"from_attributes": True}


class AnswerSubmit(BaseModel):
    question_id: UUID
    choice_id: UUID


class QuizSubmit(BaseModel):
    answers: list[AnswerSubmit]


class QuizResultResponse(BaseModel):
    id: UUID
    quiz_id: UUID
    score: float
    submitted_at: datetime

    model_config = {"from_attributes": True}
