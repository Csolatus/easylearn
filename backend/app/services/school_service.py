from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.school import SchoolCreate, SchoolUpdate

_SCHOOL_COLS = "id, name, email, website, address, is_active, created_at"


async def createSchool(data: SchoolCreate, db: AsyncSession) -> dict:
    result = await db.execute(
        text(
            "INSERT INTO schools (name, email, website, address) "
            "VALUES (:name, :email, :website, :address) "
            f"RETURNING {_SCHOOL_COLS}"
        ),
        {"name": data.name, "email": data.email, "website": data.website, "address": data.address},
    )
    await db.commit()
    return result.fetchone()._mapping


async def listSchools(db: AsyncSession) -> list[dict]:
    result = await db.execute(
        text(f"SELECT {_SCHOOL_COLS} FROM schools ORDER BY created_at DESC")
    )
    return [row._mapping for row in result.fetchall()]


async def getSchool(school_id: str, db: AsyncSession) -> dict | None:
    result = await db.execute(
        text(f"SELECT {_SCHOOL_COLS} FROM schools WHERE id = :id"),
        {"id": school_id},
    )
    row = result.fetchone()
    return row._mapping if row else None


async def updateSchool(school_id: str, data: SchoolUpdate, db: AsyncSession) -> dict | None:
    result = await db.execute(
        text(
            "UPDATE schools SET "
            "  name    = COALESCE(:name, name), "
            "  email   = COALESCE(:email, email), "
            "  website = COALESCE(:website, website), "
            "  address = COALESCE(:address, address) "
            f"WHERE id = :id RETURNING {_SCHOOL_COLS}"
        ),
        {"name": data.name, "email": data.email, "website": data.website, "address": data.address, "id": school_id},
    )
    await db.commit()
    row = result.fetchone()
    return row._mapping if row else None


async def listSchoolStudents(school_id: str, db: AsyncSession) -> list[dict]:
    result = await db.execute(
        text(
            "SELECT DISTINCT u.id, u.email, "
            "  CONCAT(u.first_name, ' ', u.last_name) AS name "
            "FROM users u "
            "JOIN course_progress cp ON cp.student_id = u.id "
            "JOIN lessons l ON l.id = cp.lesson_id "
            "JOIN courses c ON c.id = l.course_id "
            "JOIN school_course_whitelists w ON w.course_id = c.id "
            "WHERE w.school_id = :school_id "
            "ORDER BY name"
        ),
        {"school_id": school_id},
    )
    return [dict(r._mapping) for r in result.fetchall()]


async def suspendSchool(school_id: str, db: AsyncSession) -> dict | None:
    result = await db.execute(
        text(
            f"UPDATE schools SET is_active = FALSE WHERE id = :id RETURNING {_SCHOOL_COLS}"
        ),
        {"id": school_id},
    )
    await db.commit()
    row = result.fetchone()
    return row._mapping if row else None
