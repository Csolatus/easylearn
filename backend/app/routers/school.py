from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import getDb
from app.dependencies.auth import requireRoles, superAdminOnly
from app.schemas.school import SchoolCreate, SchoolResponse, SchoolUpdate
from app.services import school_service

router = APIRouter(prefix="/schools", tags=["schools"])


@router.post("", response_model=SchoolResponse, status_code=status.HTTP_201_CREATED)
async def createSchool(
    data: SchoolCreate,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(superAdminOnly),
):
    return await school_service.createSchool(data, db)


@router.get("", response_model=list[SchoolResponse])
async def listSchools(
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(superAdminOnly),
):
    return await school_service.listSchools(db)


@router.get("/{school_id}", response_model=SchoolResponse)
async def getSchool(
    school_id: str,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(superAdminOnly),
):
    school = await school_service.getSchool(school_id, db)
    if school is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="École introuvable")
    return school


@router.get("/{school_id}/students")
async def listSchoolStudents(
    school_id: str,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(requireRoles("school_admin", "super_admin")),
):
    return await school_service.listSchoolStudents(school_id, db)


@router.patch("/{school_id}", response_model=SchoolResponse)
async def updateSchool(
    school_id: str,
    data: SchoolUpdate,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(requireRoles("school_admin", "super_admin")),
):
    school = await school_service.updateSchool(school_id, data, db)
    if school is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="École introuvable")
    return school


@router.patch("/{school_id}/suspend", response_model=SchoolResponse)
async def suspendSchool(
    school_id: str,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(superAdminOnly),
):
    school = await school_service.suspendSchool(school_id, db)
    if school is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="École introuvable")
    return school
