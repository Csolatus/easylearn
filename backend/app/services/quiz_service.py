from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.quiz import ChoiceCreate, QuestionCreate, QuizSubmit


async def createQuiz(lesson_id: str, db: AsyncSession) -> dict | None:
    lesson = await db.execute(
        text("SELECT id FROM lessons WHERE id = :id"),
        {"id": lesson_id},
    )
    if not lesson.fetchone():
        return None

    existing = await db.execute(
        text("SELECT id FROM quizzes WHERE lesson_id = :lesson_id"),
        {"lesson_id": lesson_id},
    )
    if existing.fetchone():
        return None

    result = await db.execute(
        text("INSERT INTO quizzes (lesson_id) VALUES (:lesson_id) RETURNING id, lesson_id"),
        {"lesson_id": lesson_id},
    )
    await db.commit()
    quiz = result.fetchone()._mapping
    return {**quiz, "questions": []}


async def getQuiz(lesson_id: str, db: AsyncSession, include_correct: bool = False) -> dict | None:
    quiz_row = await db.execute(
        text("SELECT id, lesson_id FROM quizzes WHERE lesson_id = :lesson_id"),
        {"lesson_id": lesson_id},
    )
    quiz = quiz_row.fetchone()
    if not quiz:
        return None

    quiz_id = str(quiz.id)

    questions_result = await db.execute(
        text(
            "SELECT id, statement, ordre FROM questions "
            "WHERE quiz_id = :quiz_id ORDER BY ordre"
        ),
        {"quiz_id": quiz_id},
    )
    questions = questions_result.fetchall()

    questions_list = []
    for q in questions:
        if include_correct:
            choices_result = await db.execute(
                text("SELECT id, text, is_correct FROM choices WHERE question_id = :qid ORDER BY id"),
                {"qid": str(q.id)},
            )
        else:
            choices_result = await db.execute(
                text("SELECT id, text FROM choices WHERE question_id = :qid ORDER BY id"),
                {"qid": str(q.id)},
            )
        choices = [dict(c._mapping) for c in choices_result.fetchall()]
        questions_list.append({
            "id": q.id,
            "statement": q.statement,
            "ordre": q.ordre,
            "choices": choices,
        })

    return {"id": quiz.id, "lesson_id": quiz.lesson_id, "questions": questions_list}


async def addQuestion(lesson_id: str, data: QuestionCreate, db: AsyncSession) -> dict | None:
    quiz_row = await db.execute(
        text("SELECT id FROM quizzes WHERE lesson_id = :lesson_id"),
        {"lesson_id": lesson_id},
    )
    quiz = quiz_row.fetchone()
    if not quiz:
        return None

    result = await db.execute(
        text(
            "INSERT INTO questions (quiz_id, statement, ordre) "
            "VALUES (:quiz_id, :statement, :ordre) "
            "RETURNING id, quiz_id, statement, ordre"
        ),
        {"quiz_id": str(quiz.id), "statement": data.statement, "ordre": data.ordre},
    )
    await db.commit()
    q = result.fetchone()._mapping
    return {**q, "choices": []}


async def addChoice(question_id: str, data: ChoiceCreate, db: AsyncSession) -> dict | None:
    q = await db.execute(
        text("SELECT id FROM questions WHERE id = :id"),
        {"id": question_id},
    )
    if not q.fetchone():
        return None

    result = await db.execute(
        text(
            "INSERT INTO choices (question_id, text, is_correct) "
            "VALUES (:question_id, :text, :is_correct) "
            "RETURNING id, text, is_correct"
        ),
        {"question_id": question_id, "text": data.text, "is_correct": data.is_correct},
    )
    await db.commit()
    return result.fetchone()._mapping


async def deleteQuestion(question_id: str, db: AsyncSession) -> bool:
    result = await db.execute(
        text("DELETE FROM questions WHERE id = :id RETURNING id"),
        {"id": question_id},
    )
    await db.commit()
    return result.fetchone() is not None


async def submitQuiz(
    lesson_id: str, student_id: str, data: QuizSubmit, db: AsyncSession
) -> dict | None:
    quiz_row = await db.execute(
        text("SELECT id FROM quizzes WHERE lesson_id = :lesson_id"),
        {"lesson_id": lesson_id},
    )
    quiz = quiz_row.fetchone()
    if not quiz:
        return None

    quiz_id = str(quiz.id)

    questions_result = await db.execute(
        text("SELECT id FROM questions WHERE quiz_id = :quiz_id"),
        {"quiz_id": quiz_id},
    )
    total_questions = len(questions_result.fetchall())
    if total_questions == 0:
        return None

    correct_count = 0
    for answer in data.answers:
        choice_result = await db.execute(
            text(
                "SELECT is_correct FROM choices "
                "WHERE id = :choice_id AND question_id = :question_id"
            ),
            {"choice_id": str(answer.choice_id), "question_id": str(answer.question_id)},
        )
        choice = choice_result.fetchone()
        if choice and choice.is_correct:
            correct_count += 1

    score = correct_count / total_questions

    result_row = await db.execute(
        text(
            "INSERT INTO quiz_results (student_id, quiz_id, score) "
            "VALUES (:student_id, :quiz_id, :score) "
            "RETURNING id, quiz_id, score, submitted_at"
        ),
        {"student_id": student_id, "quiz_id": quiz_id, "score": score},
    )
    quiz_result = result_row.fetchone()
    result_id = str(quiz_result.id)

    for answer in data.answers:
        await db.execute(
            text(
                "INSERT INTO student_answers (quiz_result_id, question_id, choice_id) "
                "VALUES (:result_id, :question_id, :choice_id)"
            ),
            {
                "result_id": result_id,
                "question_id": str(answer.question_id),
                "choice_id": str(answer.choice_id),
            },
        )

    await db.commit()
    return quiz_result._mapping


async def getMyResults(lesson_id: str, student_id: str, db: AsyncSession) -> list[dict]:
    result = await db.execute(
        text(
            "SELECT qr.id, qr.quiz_id, qr.score, qr.submitted_at "
            "FROM quiz_results qr "
            "JOIN quizzes q ON q.id = qr.quiz_id "
            "WHERE q.lesson_id = :lesson_id AND qr.student_id = :student_id "
            "ORDER BY qr.submitted_at DESC"
        ),
        {"lesson_id": lesson_id, "student_id": student_id},
    )
    return [row._mapping for row in result.fetchall()]
