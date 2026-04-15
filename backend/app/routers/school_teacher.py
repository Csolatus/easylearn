from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import getDb
from app.dependencies.auth import requireRoles, teacherOnly
from app.schemas.school_teacher import InviteTeacherRequest, SchoolTeacherResponse
from app.services import school_teacher_service

router = APIRouter(tags=["school-teachers"])


@router.post(
    "/schools/{school_id}/invite",
    response_model=SchoolTeacherResponse,
    status_code=status.HTTP_201_CREATED,
)
async def inviteTeacher(
    school_id: str,
    data: InviteTeacherRequest,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(requireRoles("school_admin", "super_admin")),
):
    invitation = await school_teacher_service.inviteTeacher(school_id, data.teacher_email, db)
    if invitation is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Invitation impossible : école introuvable, email invalide, ou prof déjà invité",
        )
    return invitation


@router.get("/my-invitations", response_model=list[SchoolTeacherResponse])
async def listMyInvitations(
    db: AsyncSession = Depends(getDb),
    user: dict = Depends(teacherOnly),
):
    return await school_teacher_service.listMyInvitations(user["id"], db)


@router.patch("/school-teachers/{invitation_id}/accept", response_model=SchoolTeacherResponse)
async def acceptInvitation(
    invitation_id: str,
    db: AsyncSession = Depends(getDb),
    user: dict = Depends(teacherOnly),
):
    invitation = await school_teacher_service.acceptInvitation(invitation_id, user["id"], db)
    if invitation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invitation introuvable ou déjà traitée",
        )
    return invitation


@router.patch("/school-teachers/{invitation_id}/decline", status_code=status.HTTP_204_NO_CONTENT)
async def declineInvitation(
    invitation_id: str,
    db: AsyncSession = Depends(getDb),
    user: dict = Depends(teacherOnly),
):
    declined = await school_teacher_service.declineInvitation(invitation_id, user["id"], db)
    if not declined:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invitation introuvable ou déjà traitée",
        )


@router.patch("/school-teachers/{invitation_id}/suspend", response_model=SchoolTeacherResponse)
async def suspendTeacher(
    invitation_id: str,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(requireRoles("school_admin", "super_admin")),
):
    result = await school_teacher_service.suspendTeacher(invitation_id, db)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Relation introuvable ou prof non actif",
        )
    return result


@router.patch("/school-teachers/{invitation_id}/remove", response_model=SchoolTeacherResponse)
async def removeTeacher(
    invitation_id: str,
    db: AsyncSession = Depends(getDb),
    _: dict = Depends(requireRoles("school_admin", "super_admin")),
):
    result = await school_teacher_service.removeTeacher(invitation_id, db)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Relation introuvable",
        )
    return result
