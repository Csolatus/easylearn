from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


async def listWhitelist(school_id: str, db: AsyncSession) -> list[dict]:
    result = await db.execute(
        text(
            "SELECT c.id, c.title, c.created_by, c.visibility, c.created_at, c.updated_at "
            "FROM school_course_whitelists w "
            "JOIN courses c ON c.id = w.course_id "
            "WHERE w.school_id = :school_id"
        ),
        {"school_id": school_id},
    )
    return [row._mapping for row in result.fetchall()]


async def addToWhitelist(school_id: str, course_id: str, db: AsyncSession) -> bool:
    existing = await db.execute(
        text(
            "SELECT 1 FROM school_course_whitelists "
            "WHERE school_id = :school_id AND course_id = :course_id"
        ),
        {"school_id": school_id, "course_id": course_id},
    )
    if existing.fetchone():
        return False

    await db.execute(
        text(
            "INSERT INTO school_course_whitelists (school_id, course_id) "
            "VALUES (:school_id, :course_id)"
        ),
        {"school_id": school_id, "course_id": course_id},
    )
    await db.commit()
    return True


async def removeFromWhitelist(school_id: str, course_id: str, db: AsyncSession) -> bool:
    result = await db.execute(
        text(
            "DELETE FROM school_course_whitelists "
            "WHERE school_id = :school_id AND course_id = :course_id RETURNING course_id"
        ),
        {"school_id": school_id, "course_id": course_id},
    )
    await db.commit()
    return result.fetchone() is not None
