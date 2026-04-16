from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import getDb
from app.dependencies.auth import getCurrentUser, requireRoles
from app.schemas.analytics import SchoolAnalyticsResponse, TeacherAnalyticsResponse
from app.services import analytics_service

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/schools/{school_id}", response_model=SchoolAnalyticsResponse)
async def getSchoolAnalytics(
    school_id: str,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(requireRoles("school_admin", "super_admin")),
):
    result = await analytics_service.getSchoolAnalytics(school_id, db)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="École introuvable")
    return result


@router.get("/teachers/me", response_model=TeacherAnalyticsResponse)
async def getMyTeacherAnalytics(
    db: AsyncSession = Depends(getDb),
    user: dict = Depends(requireRoles("teacher")),
):
    result = await analytics_service.getTeacherAnalytics(user["id"], db)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Professeur introuvable")
    return result


@router.get("/teachers/{teacher_id}", response_model=TeacherAnalyticsResponse)
async def getTeacherAnalytics(
    teacher_id: str,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(requireRoles("school_admin", "super_admin")),
):
    result = await analytics_service.getTeacherAnalytics(teacher_id, db)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Professeur introuvable")
    return result
