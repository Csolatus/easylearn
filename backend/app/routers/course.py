from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import getDb
from app.dependencies.auth import getCurrentUser, getSchoolContext, teacherOrAdmin
from app.schemas.course import CourseCreate, CourseResponse, CourseUpdate
from app.schemas.lesson import LessonCreate, LessonResponse, LessonUpdate
from app.services import course_service, lesson_service

router = APIRouter(prefix="/courses", tags=["courses"])


@router.post("", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
async def createCourse(
    data: CourseCreate,
    db: AsyncSession = Depends(getDb),
    user: dict = Depends(teacherOrAdmin),
):
    return await course_service.createCourse(data, user["id"], db)


@router.get("", response_model=list[CourseResponse])
async def listCourses(
    db: AsyncSession = Depends(getDb),
    school_id: str | None = Depends(getSchoolContext),
):
    return await course_service.listCourses(db, school_id)


@router.get("/{course_id}", response_model=CourseResponse)
async def getCourse(
    course_id: str,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(getCurrentUser),
):
    course = await course_service.getCourse(course_id, db)
    if course is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cours introuvable")
    return course


@router.patch("/{course_id}", response_model=CourseResponse)
async def updateCourse(
    course_id: str,
    data: CourseUpdate,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(teacherOrAdmin),
):
    course = await course_service.updateCourse(course_id, data, db)
    if course is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cours introuvable")
    return course


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deleteCourse(
    course_id: str,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(teacherOrAdmin),
):
    deleted = await course_service.deleteCourse(course_id, db)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cours introuvable")


@router.post("/{course_id}/lessons", response_model=LessonResponse, status_code=status.HTTP_201_CREATED)
async def createLesson(
    course_id: str,
    data: LessonCreate,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(teacherOrAdmin),
):
    course = await course_service.getCourse(course_id, db)
    if course is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cours introuvable")
    return await lesson_service.createLesson(course_id, data, db)


@router.get("/{course_id}/lessons", response_model=list[LessonResponse])
async def listLessons(
    course_id: str,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(getCurrentUser),
):
    return await lesson_service.listLessons(course_id, db)


@router.get("/{course_id}/lessons/{lesson_id}", response_model=LessonResponse)
async def getLesson(
    course_id: str,
    lesson_id: str,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(getCurrentUser),
):
    lesson = await lesson_service.getLesson(course_id, lesson_id, db)
    if lesson is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Leçon introuvable")
    return lesson


@router.patch("/{course_id}/lessons/{lesson_id}", response_model=LessonResponse)
async def updateLesson(
    course_id: str,
    lesson_id: str,
    data: LessonUpdate,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(teacherOrAdmin),
):
    lesson = await lesson_service.updateLesson(course_id, lesson_id, data, db)
    if lesson is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Leçon introuvable")
    return lesson


@router.delete("/{course_id}/lessons/{lesson_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deleteLesson(
    course_id: str,
    lesson_id: str,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(teacherOrAdmin),
):
    deleted = await lesson_service.deleteLesson(course_id, lesson_id, db)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Leçon introuvable")
