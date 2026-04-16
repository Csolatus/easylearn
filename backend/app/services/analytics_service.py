from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


async def getSchoolAnalytics(school_id: str, db: AsyncSession) -> dict | None:
    # Vérifie que l'école existe
    school = await db.execute(
        text("SELECT id FROM schools WHERE id = :id"),
        {"id": school_id},
    )
    if not school.fetchone():
        return None

    total_courses_row = await db.execute(
        text("SELECT COUNT(*) FROM school_course_whitelists WHERE school_id = :school_id"),
        {"school_id": school_id},
    )
    total_courses = total_courses_row.scalar() or 0

    total_teachers_row = await db.execute(
        text(
            "SELECT COUNT(*) FROM school_teachers "
            "WHERE school_id = :school_id AND status = 'active'"
        ),
        {"school_id": school_id},
    )
    total_teachers = total_teachers_row.scalar() or 0

    total_classrooms_row = await db.execute(
        text("SELECT COUNT(*) FROM classrooms WHERE school_id = :school_id"),
        {"school_id": school_id},
    )
    total_classrooms = total_classrooms_row.scalar() or 0

    completion_row = await db.execute(
        text(
            "SELECT "
            "  COALESCE(SUM(cp.completed::int)::float / NULLIF(COUNT(*), 0) * 100, 0) "
            "FROM course_progress cp "
            "JOIN lessons l ON l.id = cp.lesson_id "
            "JOIN courses c ON c.id = l.course_id "
            "JOIN school_course_whitelists w ON w.course_id = c.id "
            "WHERE w.school_id = :school_id"
        ),
        {"school_id": school_id},
    )
    avg_lesson_completion_pct = round(completion_row.scalar() or 0.0, 1)

    quiz_score_row = await db.execute(
        text(
            "SELECT COALESCE(AVG(qr.score) * 100, 0) "
            "FROM quiz_results qr "
            "JOIN quizzes q ON q.id = qr.quiz_id "
            "JOIN lessons l ON l.id = q.lesson_id "
            "JOIN courses c ON c.id = l.course_id "
            "JOIN school_course_whitelists w ON w.course_id = c.id "
            "WHERE w.school_id = :school_id"
        ),
        {"school_id": school_id},
    )
    avg_quiz_score_pct = round(quiz_score_row.scalar() or 0.0, 1)

    return {
        "school_id": school_id,
        "total_courses": total_courses,
        "total_teachers": total_teachers,
        "total_classrooms": total_classrooms,
        "avg_lesson_completion_pct": avg_lesson_completion_pct,
        "avg_quiz_score_pct": avg_quiz_score_pct,
    }


async def getTeacherAnalytics(teacher_id: str, db: AsyncSession) -> dict | None:
    # Vérifie que l'utilisateur existe et est un professeur
    user = await db.execute(
        text("SELECT id FROM users WHERE id = :id AND role = 'teacher'"),
        {"id": teacher_id},
    )
    if not user.fetchone():
        return None

    total_courses_row = await db.execute(
        text("SELECT COUNT(*) FROM courses WHERE created_by = :teacher_id"),
        {"teacher_id": teacher_id},
    )
    total_courses = total_courses_row.scalar() or 0

    total_lessons_row = await db.execute(
        text(
            "SELECT COUNT(*) FROM lessons "
            "WHERE course_id IN (SELECT id FROM courses WHERE created_by = :teacher_id)"
        ),
        {"teacher_id": teacher_id},
    )
    total_lessons = total_lessons_row.scalar() or 0

    completion_row = await db.execute(
        text(
            "SELECT "
            "  COALESCE(SUM(cp.completed::int)::float / NULLIF(COUNT(*), 0) * 100, 0) "
            "FROM course_progress cp "
            "JOIN lessons l ON l.id = cp.lesson_id "
            "JOIN courses c ON c.id = l.course_id "
            "WHERE c.created_by = :teacher_id"
        ),
        {"teacher_id": teacher_id},
    )
    avg_lesson_completion_pct = round(completion_row.scalar() or 0.0, 1)

    quiz_score_row = await db.execute(
        text(
            "SELECT COALESCE(AVG(qr.score) * 100, 0) "
            "FROM quiz_results qr "
            "JOIN quizzes q ON q.id = qr.quiz_id "
            "JOIN lessons l ON l.id = q.lesson_id "
            "JOIN courses c ON c.id = l.course_id "
            "WHERE c.created_by = :teacher_id"
        ),
        {"teacher_id": teacher_id},
    )
    avg_quiz_score_pct = round(quiz_score_row.scalar() or 0.0, 1)

    # Stats par cours
    courses_row = await db.execute(
        text("SELECT id, title FROM courses WHERE created_by = :teacher_id ORDER BY created_at"),
        {"teacher_id": teacher_id},
    )
    courses_list = courses_row.fetchall()

    courses_analytics = []
    for course in courses_list:
        course_id = str(course.id)

        total_l_row = await db.execute(
            text("SELECT COUNT(*) FROM lessons WHERE course_id = :course_id"),
            {"course_id": course_id},
        )
        total_l = total_l_row.scalar() or 0

        completed_l_row = await db.execute(
            text(
                "SELECT COUNT(*) FROM course_progress cp "
                "JOIN lessons l ON l.id = cp.lesson_id "
                "WHERE l.course_id = :course_id AND cp.completed = TRUE"
            ),
            {"course_id": course_id},
        )
        completed_l = completed_l_row.scalar() or 0

        unique_students_row = await db.execute(
            text(
                "SELECT COUNT(DISTINCT cp.student_id) FROM course_progress cp "
                "JOIN lessons l ON l.id = cp.lesson_id "
                "WHERE l.course_id = :course_id"
            ),
            {"course_id": course_id},
        )
        unique_students = unique_students_row.scalar() or 0

        course_quiz_row = await db.execute(
            text(
                "SELECT COALESCE(AVG(qr.score) * 100, 0) "
                "FROM quiz_results qr "
                "JOIN quizzes q ON q.id = qr.quiz_id "
                "JOIN lessons l ON l.id = q.lesson_id "
                "WHERE l.course_id = :course_id"
            ),
            {"course_id": course_id},
        )
        course_quiz_score = round(course_quiz_row.scalar() or 0.0, 1)

        courses_analytics.append({
            "course_id": course.id,
            "title": course.title,
            "total_lessons": total_l,
            "completed_lessons": completed_l,
            "unique_students": unique_students,
            "avg_quiz_score_pct": course_quiz_score,
        })

    return {
        "teacher_id": teacher_id,
        "total_courses": total_courses,
        "total_lessons": total_lessons,
        "avg_lesson_completion_pct": avg_lesson_completion_pct,
        "avg_quiz_score_pct": avg_quiz_score_pct,
        "courses": courses_analytics,
    }
