import pytest

from tests.conftest import auth_headers


# ── Helpers ────────────────────────────────────────────────────────────────────

async def setup_course_and_lesson(client, teacher_token):
    course = (await client.post(
        "/courses",
        json={"title": "Quiz Course", "visibility": "public"},
        headers=auth_headers(teacher_token),
    )).json()
    lesson = (await client.post(
        f"/courses/{course['id']}/lessons",
        json={"title": "Quiz Lesson", "ordre": 1},
        headers=auth_headers(teacher_token),
    )).json()
    return course, lesson


async def create_quiz(client, teacher_token, lesson_id):
    response = await client.post(
        f"/lessons/{lesson_id}/quiz",
        headers=auth_headers(teacher_token),
    )
    assert response.status_code == 201
    return response.json()


async def add_question_with_choices(client, teacher_token, lesson_id, statement="What is 2+2?"):
    question = (await client.post(
        f"/lessons/{lesson_id}/quiz/questions",
        json={"statement": statement, "ordre": 1},
        headers=auth_headers(teacher_token),
    )).json()

    correct = (await client.post(
        f"/questions/{question['id']}/choices",
        json={"text": "4", "is_correct": True},
        headers=auth_headers(teacher_token),
    )).json()

    wrong = (await client.post(
        f"/questions/{question['id']}/choices",
        json={"text": "5", "is_correct": False},
        headers=auth_headers(teacher_token),
    )).json()

    return question, correct, wrong


# ── Quiz creation ──────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_create_quiz(client, teacher_token):
    _, lesson = await setup_course_and_lesson(client, teacher_token)
    quiz = await create_quiz(client, teacher_token, lesson["id"])
    assert "id" in quiz


@pytest.mark.asyncio
async def test_get_quiz(client, teacher_token, student_token):
    _, lesson = await setup_course_and_lesson(client, teacher_token)
    await create_quiz(client, teacher_token, lesson["id"])
    response = await client.get(
        f"/lessons/{lesson['id']}/quiz",
        headers=auth_headers(student_token),
    )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_create_question(client, teacher_token):
    _, lesson = await setup_course_and_lesson(client, teacher_token)
    await create_quiz(client, teacher_token, lesson["id"])
    response = await client.post(
        f"/lessons/{lesson['id']}/quiz/questions",
        json={"statement": "What is Python?", "ordre": 1},
        headers=auth_headers(teacher_token),
    )
    assert response.status_code == 201
    assert response.json()["statement"] == "What is Python?"


@pytest.mark.asyncio
async def test_create_choice(client, teacher_token):
    _, lesson = await setup_course_and_lesson(client, teacher_token)
    await create_quiz(client, teacher_token, lesson["id"])
    question, correct, wrong = await add_question_with_choices(client, teacher_token, lesson["id"])
    assert correct["is_correct"] is True
    assert wrong["is_correct"] is False


@pytest.mark.asyncio
async def test_delete_question(client, teacher_token):
    _, lesson = await setup_course_and_lesson(client, teacher_token)
    await create_quiz(client, teacher_token, lesson["id"])
    question, _, _ = await add_question_with_choices(client, teacher_token, lesson["id"])
    response = await client.delete(
        f"/questions/{question['id']}",
        headers=auth_headers(teacher_token),
    )
    assert response.status_code == 204


# ── Quiz submission & scoring ──────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_submit_quiz_perfect_score(client, teacher_token, student_token):
    _, lesson = await setup_course_and_lesson(client, teacher_token)
    await create_quiz(client, teacher_token, lesson["id"])
    question, correct, _ = await add_question_with_choices(client, teacher_token, lesson["id"])

    response = await client.post(
        f"/lessons/{lesson['id']}/quiz/submit",
        json={"answers": [{"question_id": question["id"], "choice_id": correct["id"]}]},
        headers=auth_headers(student_token),
    )
    assert response.status_code == 200
    data = response.json()
    assert data["score"] == 100.0


@pytest.mark.asyncio
async def test_submit_quiz_wrong_answer(client, teacher_token, student_token):
    _, lesson = await setup_course_and_lesson(client, teacher_token)
    await create_quiz(client, teacher_token, lesson["id"])
    question, _, wrong = await add_question_with_choices(client, teacher_token, lesson["id"])

    response = await client.post(
        f"/lessons/{lesson['id']}/quiz/submit",
        json={"answers": [{"question_id": question["id"], "choice_id": wrong["id"]}]},
        headers=auth_headers(student_token),
    )
    assert response.status_code == 200
    assert response.json()["score"] == 0.0


@pytest.mark.asyncio
async def test_get_quiz_results(client, teacher_token, student_token):
    _, lesson = await setup_course_and_lesson(client, teacher_token)
    await create_quiz(client, teacher_token, lesson["id"])
    question, correct, _ = await add_question_with_choices(client, teacher_token, lesson["id"])

    await client.post(
        f"/lessons/{lesson['id']}/quiz/submit",
        json={"answers": [{"question_id": question["id"], "choice_id": correct["id"]}]},
        headers=auth_headers(student_token),
    )

    response = await client.get(
        f"/lessons/{lesson['id']}/quiz/results/me",
        headers=auth_headers(student_token),
    )
    assert response.status_code == 200
    results = response.json()
    assert isinstance(results, list)
    assert len(results) >= 1


@pytest.mark.asyncio
async def test_submit_quiz_as_teacher_forbidden(client, teacher_token):
    _, lesson = await setup_course_and_lesson(client, teacher_token)
    await create_quiz(client, teacher_token, lesson["id"])
    response = await client.post(
        f"/lessons/{lesson['id']}/quiz/submit",
        json={"answers": []},
        headers=auth_headers(teacher_token),
    )
    assert response.status_code == 403
