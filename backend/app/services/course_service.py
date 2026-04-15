from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.course import CourseCreate, CourseUpdate


async def createCourse(data: CourseCreate, user_id: str, db: AsyncSession) -> dict:
    result = await db.execute(
        text(
            "INSERT INTO courses (title, created_by, visibility) "
            "VALUES (:title, :created_by, :visibility) "
            "RETURNING id, title, created_by, visibility, created_at, updated_at"
        ),
        {"title": data.title, "created_by": user_id, "visibility": data.visibility},
    )
    await db.commit()
    return result.fetchone()._mapping


async def listCourses(db: AsyncSession) -> list[dict]:
    result = await db.execute(
        text(
            "SELECT id, title, created_by, visibility, created_at, updated_at "
            "FROM courses ORDER BY created_at DESC"
        )
    )
    return [row._mapping for row in result.fetchall()]


async def getCourse(course_id: str, db: AsyncSession) -> dict | None:
    result = await db.execute(
        text(
            "SELECT id, title, created_by, visibility, created_at, updated_at "
            "FROM courses WHERE id = :id"
        ),
        {"id": course_id},
    )
    row = result.fetchone()
    return row._mapping if row else None


async def updateCourse(course_id: str, data: CourseUpdate, db: AsyncSession) -> dict | None:
    fields = {k: v for k, v in data.model_dump().items() if v is not None}
    if not fields:
        return await getCourse(course_id, db)

    set_clause = ", ".join(f"{k} = :{k}" for k in fields)
    fields["id"] = course_id

    result = await db.execute(
        text(
            f"UPDATE courses SET {set_clause}, updated_at = NOW() WHERE id = :id "
            "RETURNING id, title, created_by, visibility, created_at, updated_at"
        ),
        fields,
    )
    await db.commit()
    row = result.fetchone()
    return row._mapping if row else None


async def deleteCourse(course_id: str, db: AsyncSession) -> bool:
    result = await db.execute(
        text("DELETE FROM courses WHERE id = :id RETURNING id"),
        {"id": course_id},
    )
    await db.commit()
    return result.fetchone() is not None


async def assignCourseToClassroom(classroom_id: str, course_id: str, db: AsyncSession) -> bool:
    existing = await db.execute(
        text(
            "SELECT 1 FROM classroom_courses "
            "WHERE classroom_id = :classroom_id AND course_id = :course_id"
        ),
        {"classroom_id": classroom_id, "course_id": course_id},
    )
    if existing.fetchone():
        return False

    await db.execute(
        text(
            "INSERT INTO classroom_courses (classroom_id, course_id) "
            "VALUES (:classroom_id, :course_id)"
        ),
        {"classroom_id": classroom_id, "course_id": course_id},
    )
    await db.commit()
    return True
