from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.school import SchoolCreate, SchoolUpdate


async def createSchool(data: SchoolCreate, db: AsyncSession) -> dict:
    result = await db.execute(
        text(
            "INSERT INTO schools (name) VALUES (:name) "
            "RETURNING id, name, is_active, created_at"
        ),
        {"name": data.name},
    )
    await db.commit()
    row = result.fetchone()
    return row._mapping


async def listSchools(db: AsyncSession) -> list[dict]:
    result = await db.execute(
        text("SELECT id, name, is_active, created_at FROM schools ORDER BY created_at DESC")
    )
    return [row._mapping for row in result.fetchall()]


async def getSchool(school_id: str, db: AsyncSession) -> dict | None:
    result = await db.execute(
        text("SELECT id, name, is_active, created_at FROM schools WHERE id = :id"),
        {"id": school_id},
    )
    row = result.fetchone()
    return row._mapping if row else None


async def updateSchool(school_id: str, data: SchoolUpdate, db: AsyncSession) -> dict | None:
    result = await db.execute(
        text(
            "UPDATE schools SET name = :name WHERE id = :id "
            "RETURNING id, name, is_active, created_at"
        ),
        {"name": data.name, "id": school_id},
    )
    await db.commit()
    row = result.fetchone()
    return row._mapping if row else None


async def suspendSchool(school_id: str, db: AsyncSession) -> dict | None:
    result = await db.execute(
        text(
            "UPDATE schools SET is_active = FALSE WHERE id = :id "
            "RETURNING id, name, is_active, created_at"
        ),
        {"id": school_id},
    )
    await db.commit()
    row = result.fetchone()
    return row._mapping if row else None
