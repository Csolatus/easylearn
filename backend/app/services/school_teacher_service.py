from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


async def inviteTeacher(school_id: str, teacher_email: str, db: AsyncSession) -> dict | None:
    # Vérifier que l'école existe
    school = await db.execute(
        text("SELECT id FROM schools WHERE id = :id AND is_active = TRUE"),
        {"id": school_id},
    )
    if not school.fetchone():
        return None

    # Récupérer le teacher par email
    user = await db.execute(
        text("SELECT id, role FROM users WHERE email = :email"),
        {"email": teacher_email},
    )
    row = user.fetchone()
    if not row or row.role != "teacher":
        return "NOT_FOUND"

    # Vérifier qu'il n'est pas déjà invité/actif
    existing = await db.execute(
        text(
            "SELECT id, status FROM school_teachers "
            "WHERE school_id = :school_id AND teacher_id = :teacher_id"
        ),
        {"school_id": school_id, "teacher_id": str(row.id)},
    )
    if existing.fetchone():
        return "CONFLICT"

    result = await db.execute(
        text(
            "INSERT INTO school_teachers (school_id, teacher_id) "
            "VALUES (:school_id, :teacher_id) "
            "RETURNING id, school_id, teacher_id, status, invited_at, joined_at"
        ),
        {"school_id": school_id, "teacher_id": str(row.id)},
    )
    await db.commit()
    return result.fetchone()._mapping


async def getInvitation(invitation_id: str, db: AsyncSession) -> dict | None:
    result = await db.execute(
        text(
            "SELECT id, school_id, teacher_id, status, invited_at, joined_at "
            "FROM school_teachers WHERE id = :id"
        ),
        {"id": invitation_id},
    )
    row = result.fetchone()
    return row._mapping if row else None


async def acceptInvitation(invitation_id: str, teacher_id: str, db: AsyncSession) -> dict | None:
    result = await db.execute(
        text(
            "UPDATE school_teachers SET status = 'active', joined_at = NOW() "
            "WHERE id = :id AND teacher_id = :teacher_id AND status = 'invited' "
            "RETURNING id, school_id, teacher_id, status, invited_at, joined_at"
        ),
        {"id": invitation_id, "teacher_id": teacher_id},
    )
    await db.commit()
    row = result.fetchone()
    return row._mapping if row else None


async def declineInvitation(invitation_id: str, teacher_id: str, db: AsyncSession) -> bool:
    result = await db.execute(
        text(
            "DELETE FROM school_teachers "
            "WHERE id = :id AND teacher_id = :teacher_id AND status = 'invited' "
            "RETURNING id"
        ),
        {"id": invitation_id, "teacher_id": teacher_id},
    )
    await db.commit()
    return result.fetchone() is not None


async def suspendTeacher(invitation_id: str, db: AsyncSession) -> dict | None:
    result = await db.execute(
        text(
            "UPDATE school_teachers SET status = 'suspended' "
            "WHERE id = :id AND status = 'active' "
            "RETURNING id, school_id, teacher_id, status, invited_at, joined_at"
        ),
        {"id": invitation_id},
    )
    await db.commit()
    row = result.fetchone()
    return row._mapping if row else None


async def removeTeacher(invitation_id: str, db: AsyncSession) -> dict | None:
    result = await db.execute(
        text(
            "UPDATE school_teachers SET status = 'removed' "
            "WHERE id = :id AND status IN ('active', 'suspended') "
            "RETURNING id, school_id, teacher_id, status, invited_at, joined_at"
        ),
        {"id": invitation_id},
    )
    await db.commit()
    row = result.fetchone()
    return row._mapping if row else None


async def listSchoolTeachers(school_id: str, db: AsyncSession) -> list[dict]:
    result = await db.execute(
        text(
            "SELECT st.id, u.email, "
            "  CONCAT(u.first_name, ' ', u.last_name) AS name, "
            "  st.status "
            "FROM school_teachers st "
            "JOIN users u ON u.id = st.teacher_id "
            "WHERE st.school_id = :school_id "
            "  AND st.status IN ('active', 'invited', 'suspended') "
            "ORDER BY st.invited_at DESC"
        ),
        {"school_id": school_id},
    )
    return [
        {"id": r.id, "email": r.email, "name": r.name, "status": r.status, "classes": 0}
        for r in result.fetchall()
    ]


async def listMyInvitations(teacher_id: str, db: AsyncSession) -> list[dict]:
    result = await db.execute(
        text(
            "SELECT id, school_id, teacher_id, status, invited_at, joined_at "
            "FROM school_teachers WHERE teacher_id = :teacher_id ORDER BY invited_at DESC"
        ),
        {"teacher_id": teacher_id},
    )
    return [row._mapping for row in result.fetchall()]
