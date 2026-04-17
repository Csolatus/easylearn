from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import getDb
from app.dependencies.auth import getCurrentUser, studentOnly, teacherOrAdmin
from app.schemas.progress import ActivityItem, CourseProgressResponse, LessonProgressResponse
from app.schemas.quiz import (
    ChoiceCreate,
    ChoiceResponse,
    QuestionCreate,
    QuestionResponse,
    QuizResponse,
    QuizResultResponse,
    QuizSubmit,
)
from app.services import progress_service, quiz_service

router = APIRouter(tags=["quiz"])


# ── Quiz management (teacher) ─────────────────────────────────────────────────

@router.post(
    "/lessons/{lesson_id}/quiz",
    response_model=QuizResponse,
    status_code=status.HTTP_201_CREATED,
)
async def createQuiz(
    lesson_id: str,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(teacherOrAdmin),
):
    quiz = await quiz_service.createQuiz(lesson_id, db)
    if quiz is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Leçon introuvable ou quiz déjà existant",
        )
    return quiz


@router.get("/lessons/{lesson_id}/quiz", response_model=QuizResponse)
async def getQuiz(
    lesson_id: str,
    db: AsyncSession = Depends(getDb),
    user: dict = Depends(getCurrentUser),
):
    include_correct = user["role"] in ("teacher", "school_admin", "super_admin")
    quiz = await quiz_service.getQuiz(lesson_id, db, include_correct=include_correct)
    if quiz is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz introuvable")
    return quiz


@router.post(
    "/lessons/{lesson_id}/quiz/questions",
    response_model=QuestionResponse,
    status_code=status.HTTP_201_CREATED,
)
async def addQuestion(
    lesson_id: str,
    data: QuestionCreate,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(teacherOrAdmin),
):
    question = await quiz_service.addQuestion(lesson_id, data, db)
    if question is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz introuvable pour cette leçon")
    return question


@router.post(
    "/questions/{question_id}/choices",
    response_model=ChoiceResponse,
    status_code=status.HTTP_201_CREATED,
)
async def addChoice(
    question_id: str,
    data: ChoiceCreate,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(teacherOrAdmin),
):
    choice = await quiz_service.addChoice(question_id, data, db)
    if choice is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question introuvable")
    return choice


@router.delete("/questions/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deleteQuestion(
    question_id: str,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(teacherOrAdmin),
):
    deleted = await quiz_service.deleteQuestion(question_id, db)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question introuvable")


# ── Quiz submission (student) ─────────────────────────────────────────────────

@router.post("/lessons/{lesson_id}/quiz/submit", response_model=QuizResultResponse)
async def submitQuiz(
    lesson_id: str,
    data: QuizSubmit,
    db: AsyncSession = Depends(getDb),
    user: dict = Depends(studentOnly),
):
    result = await quiz_service.submitQuiz(lesson_id, user["id"], data, db)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz introuvable ou aucune question disponible",
        )
    return result


@router.get("/lessons/{lesson_id}/quiz/results/me", response_model=list[QuizResultResponse])
async def getMyResults(
    lesson_id: str,
    db: AsyncSession = Depends(getDb),
    user: dict = Depends(studentOnly),
):
    return await quiz_service.getMyResults(lesson_id, user["id"], db)


# ── Progression (student) ─────────────────────────────────────────────────────

@router.post(
    "/lessons/{lesson_id}/complete",
    response_model=LessonProgressResponse,
    status_code=status.HTTP_200_OK,
)
async def markLessonComplete(
    lesson_id: str,
    db: AsyncSession = Depends(getDb),
    user: dict = Depends(studentOnly),
):
    result = await progress_service.markLessonComplete(lesson_id, user["id"], db)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Leçon introuvable")
    return result


@router.get("/students/me/activity", response_model=list[ActivityItem])
async def getMyActivity(
    db: AsyncSession = Depends(getDb),
    user: dict = Depends(studentOnly),
):
    return await progress_service.getStudentActivity(user["id"], db)


@router.get("/courses/{course_id}/progress/me", response_model=CourseProgressResponse)
async def getCourseProgress(
    course_id: str,
    db: AsyncSession = Depends(getDb),
    user: dict = Depends(studentOnly),
):
    return await progress_service.getCourseProgress(course_id, user["id"], db)
