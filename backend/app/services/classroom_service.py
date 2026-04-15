from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.classroom import ClassroomCreate, ClassroomUpdate


async def createClassroom(data: ClassroomCreate, db: AsyncSession) -> dict:
    result = await db.execute(
        text(
            "INSERT INTO classrooms (name, school_id) VALUES (:name, :school_id) "
            "RETURNING id, name, school_id, invite_code, is_archived, created_at"
        ),
        {"name": data.name, "school_id": str(data.school_id) if data.school_id else None},
    )
    await db.commit()
    return result.fetchone()._mapping


async def listClassrooms(school_id: str | None, db: AsyncSession) -> list[dict]:
    if school_id:
        result = await db.execute(
            text(
                "SELECT id, name, school_id, invite_code, is_archived, created_at "
                "FROM classrooms WHERE school_id = :school_id ORDER BY created_at DESC"
            ),
            {"school_id": school_id},
        )
    else:
        result = await db.execute(
            text(
                "SELECT id, name, school_id, invite_code, is_archived, created_at "
                "FROM classrooms ORDER BY created_at DESC"
            )
        )
    return [row._mapping for row in result.fetchall()]


async def getClassroom(classroom_id: str, db: AsyncSession) -> dict | None:
    result = await db.execute(
        text(
            "SELECT id, name, school_id, invite_code, is_archived, created_at "
            "FROM classrooms WHERE id = :id"
        ),
        {"id": classroom_id},
    )
    row = result.fetchone()
    return row._mapping if row else None


async def updateClassroom(classroom_id: str, data: ClassroomUpdate, db: AsyncSession) -> dict | None:
    result = await db.execute(
        text(
            "UPDATE classrooms SET name = :name WHERE id = :id "
            "RETURNING id, name, school_id, invite_code, is_archived, created_at"
        ),
        {"name": data.name, "id": classroom_id},
    )
    await db.commit()
    row = result.fetchone()
    return row._mapping if row else None


async def archiveClassroom(classroom_id: str, db: AsyncSession) -> dict | None:
    result = await db.execute(
        text(
            "UPDATE classrooms SET is_archived = TRUE WHERE id = :id "
            "RETURNING id, name, school_id, invite_code, is_archived, created_at"
        ),
        {"id": classroom_id},
    )
    await db.commit()
    row = result.fetchone()
    return row._mapping if row else None
