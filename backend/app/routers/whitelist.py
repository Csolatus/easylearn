from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import getDb
from app.dependencies.auth import requireRoles
from app.schemas.course import CourseResponse
from app.services import whitelist_service

router = APIRouter(prefix="/schools", tags=["whitelist"])


@router.get("/{school_id}/whitelist", response_model=list[CourseResponse])
async def listWhitelist(
    school_id: str,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(requireRoles("school_admin", "super_admin")),
):
    return await whitelist_service.listWhitelist(school_id, db)


@router.post("/{school_id}/whitelist/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
async def addToWhitelist(
    school_id: str,
    course_id: str,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(requireRoles("school_admin", "super_admin")),
):
    added = await whitelist_service.addToWhitelist(school_id, course_id, db)
    if not added:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Cours déjà dans la whitelist")


@router.delete("/{school_id}/whitelist/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
async def removeFromWhitelist(
    school_id: str,
    course_id: str,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(requireRoles("school_admin", "super_admin")),
):
    removed = await whitelist_service.removeFromWhitelist(school_id, course_id, db)
    if not removed:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cours introuvable dans la whitelist")
