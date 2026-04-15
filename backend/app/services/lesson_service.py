from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.lesson import LessonCreate, LessonUpdate


async def createLesson(course_id: str, data: LessonCreate, db: AsyncSession) -> dict:
    result = await db.execute(
        text(
            "INSERT INTO lessons (course_id, title, docs, ordre) "
            "VALUES (:course_id, :title, :docs, :ordre) "
            "RETURNING id, course_id, title, docs, ordre, updated_at"
        ),
        {"course_id": course_id, "title": data.title, "docs": data.docs, "ordre": data.ordre},
    )
    await db.commit()
    return result.fetchone()._mapping


async def listLessons(course_id: str, db: AsyncSession) -> list[dict]:
    result = await db.execute(
        text(
            "SELECT id, course_id, title, docs, ordre, updated_at "
            "FROM lessons WHERE course_id = :course_id ORDER BY ordre ASC"
        ),
        {"course_id": course_id},
    )
    return [row._mapping for row in result.fetchall()]


async def getLesson(course_id: str, lesson_id: str, db: AsyncSession) -> dict | None:
    result = await db.execute(
        text(
            "SELECT id, course_id, title, docs, ordre, updated_at "
            "FROM lessons WHERE id = :id AND course_id = :course_id"
        ),
        {"id": lesson_id, "course_id": course_id},
    )
    row = result.fetchone()
    return row._mapping if row else None


async def updateLesson(course_id: str, lesson_id: str, data: LessonUpdate, db: AsyncSession) -> dict | None:
    fields = {k: v for k, v in data.model_dump().items() if v is not None}
    if not fields:
        return await getLesson(course_id, lesson_id, db)

    set_clause = ", ".join(f"{k} = :{k}" for k in fields)
    fields["id"] = lesson_id
    fields["course_id"] = course_id

    result = await db.execute(
        text(
            f"UPDATE lessons SET {set_clause}, updated_at = NOW() "
            "WHERE id = :id AND course_id = :course_id "
            "RETURNING id, course_id, title, docs, ordre, updated_at"
        ),
        fields,
    )
    await db.commit()
    row = result.fetchone()
    return row._mapping if row else None


async def deleteLesson(course_id: str, lesson_id: str, db: AsyncSession) -> bool:
    result = await db.execute(
        text("DELETE FROM lessons WHERE id = :id AND course_id = :course_id RETURNING id"),
        {"id": lesson_id, "course_id": course_id},
    )
    await db.commit()
    return result.fetchone() is not None
