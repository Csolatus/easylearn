from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import getDb
from app.dependencies.auth import teacherOrAdmin
from app.schemas.classroom import ClassroomCreate, ClassroomResponse, ClassroomUpdate
from app.services import classroom_service, course_service

router = APIRouter(prefix="/classrooms", tags=["classrooms"])


@router.post("", response_model=ClassroomResponse, status_code=status.HTTP_201_CREATED)
async def createClassroom(
    data: ClassroomCreate,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(teacherOrAdmin),
):
    return await classroom_service.createClassroom(data, db)


@router.get("", response_model=list[ClassroomResponse])
async def listClassrooms(
    school_id: str | None = Query(default=None),
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(teacherOrAdmin),
):
    return await classroom_service.listClassrooms(school_id, db)


@router.get("/{classroom_id}", response_model=ClassroomResponse)
async def getClassroom(
    classroom_id: str,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(teacherOrAdmin),
):
    classroom = await classroom_service.getClassroom(classroom_id, db)
    if classroom is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classe introuvable")
    return classroom


@router.patch("/{classroom_id}", response_model=ClassroomResponse)
async def updateClassroom(
    classroom_id: str,
    data: ClassroomUpdate,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(teacherOrAdmin),
):
    classroom = await classroom_service.updateClassroom(classroom_id, data, db)
    if classroom is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classe introuvable")
    return classroom


@router.patch("/{classroom_id}/archive", response_model=ClassroomResponse)
async def archiveClassroom(
    classroom_id: str,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(teacherOrAdmin),
):
    classroom = await classroom_service.archiveClassroom(classroom_id, db)
    if classroom is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classe introuvable")
    return classroom


@router.post("/{classroom_id}/courses", status_code=status.HTTP_204_NO_CONTENT)
async def assignCourse(
    classroom_id: str,
    course_id: str = Query(...),
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(teacherOrAdmin),
):
    assigned = await course_service.assignCourseToClassroom(classroom_id, course_id, db)
    if not assigned:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Cours déjà assigné à cette classe")


@router.delete("/{classroom_id}/courses/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
async def removeCourse(
    classroom_id: str,
    course_id: str,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(teacherOrAdmin),
):
    removed = await course_service.removeCourseFromClassroom(classroom_id, course_id, db)
    if not removed:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assignation introuvable")
