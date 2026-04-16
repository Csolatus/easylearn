from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


async def getStudentActivity(student_id: str, db: AsyncSession, limit: int = 10) -> list[dict]:
    result = await db.execute(
        text(
            "SELECT type, lesson_title, course_title, ts AS timestamp FROM ("
            "  SELECT 'lesson_complete' AS type,"
            "         l.title AS lesson_title,"
            "         c.title AS course_title,"
            "         cp.completed_at AS ts"
            "  FROM course_progress cp"
            "  JOIN lessons l ON l.id = cp.lesson_id"
            "  JOIN courses c ON c.id = l.course_id"
            "  WHERE cp.student_id = :student_id"
            "    AND cp.completed = TRUE"
            "    AND cp.completed_at IS NOT NULL"
            "  UNION ALL"
            "  SELECT 'quiz_submit' AS type,"
            "         l.title AS lesson_title,"
            "         c.title AS course_title,"
            "         qr.submitted_at AS ts"
            "  FROM quiz_results qr"
            "  JOIN quizzes q ON q.id = qr.quiz_id"
            "  JOIN lessons l ON l.id = q.lesson_id"
            "  JOIN courses c ON c.id = l.course_id"
            "  WHERE qr.student_id = :student_id"
            ") events"
            " ORDER BY ts DESC"
            " LIMIT :limit"
        ),
        {"student_id": student_id, "limit": limit},
    )
    return [dict(row._mapping) for row in result.fetchall()]


async def markLessonComplete(lesson_id: str, student_id: str, db: AsyncSession) -> dict | None:
    lesson = await db.execute(
        text("SELECT id FROM lessons WHERE id = :id"),
        {"id": lesson_id},
    )
    if not lesson.fetchone():
        return None

    result = await db.execute(
        text(
            "INSERT INTO course_progress (student_id, lesson_id, completed, completed_at) "
            "VALUES (:student_id, :lesson_id, TRUE, NOW()) "
            "ON CONFLICT (student_id, lesson_id) DO UPDATE "
            "SET completed = TRUE, completed_at = NOW() "
            "RETURNING lesson_id, completed, completed_at"
        ),
        {"student_id": student_id, "lesson_id": lesson_id},
    )
    await db.commit()
    return result.fetchone()._mapping


async def getCourseProgress(course_id: str, student_id: str, db: AsyncSession) -> dict:
    lessons_result = await db.execute(
        text("SELECT id FROM lessons WHERE course_id = :course_id ORDER BY ordre"),
        {"course_id": course_id},
    )
    lessons = lessons_result.fetchall()
    total = len(lessons)

    if total == 0:
        return {
            "course_id": course_id,
            "total_lessons": 0,
            "completed_lessons": 0,
            "percentage": 0.0,
            "lessons": [],
        }

    progress_result = await db.execute(
        text(
            "SELECT lesson_id, completed, completed_at "
            "FROM course_progress "
            "WHERE student_id = :student_id "
            "AND lesson_id IN (SELECT id FROM lessons WHERE course_id = :course_id)"
        ),
        {"student_id": student_id, "course_id": course_id},
    )
    progress_map = {str(row.lesson_id): row for row in progress_result.fetchall()}

    lessons_progress = []
    completed_count = 0
    for lesson in lessons:
        lid = str(lesson.id)
        prog = progress_map.get(lid)
        is_completed = prog.completed if prog else False
        if is_completed:
            completed_count += 1
        lessons_progress.append({
            "lesson_id": lesson.id,
            "completed": is_completed,
            "completed_at": prog.completed_at if prog else None,
        })

    return {
        "course_id": course_id,
        "total_lessons": total,
        "completed_lessons": completed_count,
        "percentage": round(completed_count / total * 100, 1),
        "lessons": lessons_progress,
    }
