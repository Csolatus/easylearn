import pytest

from tests.conftest import auth_headers


# ── Helpers ────────────────────────────────────────────────────────────────────

async def setup_course_with_lesson(client, teacher_token):
    course = (await client.post(
        "/courses",
        json={"title": "Progress Course", "visibility": "public"},
        headers=auth_headers(teacher_token),
    )).json()
    lesson = (await client.post(
        f"/courses/{course['id']}/lessons",
        json={"title": "Progress Lesson", "ordre": 1},
        headers=auth_headers(teacher_token),
    )).json()
    return course, lesson


async def setup_quiz_with_question(client, teacher_token, lesson_id):
    await client.post(f"/lessons/{lesson_id}/quiz", headers=auth_headers(teacher_token))
    question = (await client.post(
        f"/lessons/{lesson_id}/quiz/questions",
        json={"statement": "Q?", "ordre": 1},
        headers=auth_headers(teacher_token),
    )).json()
    correct = (await client.post(
        f"/questions/{question['id']}/choices",
        json={"text": "Right", "is_correct": True},
        headers=auth_headers(teacher_token),
    )).json()
    return question, correct


# ── Lesson completion ──────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_complete_lesson(client, teacher_token, student_token):
    _, lesson = await setup_course_with_lesson(client, teacher_token)
    response = await client.post(
        f"/lessons/{lesson['id']}/complete",
        headers=auth_headers(student_token),
    )
    assert response.status_code == 200
    data = response.json()
    assert data["lesson_id"] == lesson["id"]
    assert data["completed"] is True


@pytest.mark.asyncio
async def test_complete_lesson_idempotent(client, teacher_token, student_token):
    _, lesson = await setup_course_with_lesson(client, teacher_token)
    await client.post(f"/lessons/{lesson['id']}/complete", headers=auth_headers(student_token))
    response = await client.post(f"/lessons/{lesson['id']}/complete", headers=auth_headers(student_token))
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_complete_lesson_as_teacher_forbidden(client, teacher_token):
    _, lesson = await setup_course_with_lesson(client, teacher_token)
    response = await client.post(
        f"/lessons/{lesson['id']}/complete",
        headers=auth_headers(teacher_token),
    )
    assert response.status_code == 403


# ── Course progress ────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_course_progress_zero(client, teacher_token, student_token):
    course, _ = await setup_course_with_lesson(client, teacher_token)
    response = await client.get(
        f"/courses/{course['id']}/progress/me",
        headers=auth_headers(student_token),
    )
    assert response.status_code == 200
    data = response.json()
    assert data["course_id"] == course["id"]
    assert data["total_lessons"] == 1
    assert data["completed_lessons"] == 0
    assert data["percentage"] == 0.0


@pytest.mark.asyncio
async def test_course_progress_after_completion(client, teacher_token, student_token):
    course, lesson = await setup_course_with_lesson(client, teacher_token)
    await client.post(f"/lessons/{lesson['id']}/complete", headers=auth_headers(student_token))
    response = await client.get(
        f"/courses/{course['id']}/progress/me",
        headers=auth_headers(student_token),
    )
    assert response.status_code == 200
    data = response.json()
    assert data["completed_lessons"] == 1
    assert data["percentage"] == 100.0


# ── Activity feed ──────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_student_activity_after_quiz(client, teacher_token, student_token):
    _, lesson = await setup_course_with_lesson(client, teacher_token)
    question, correct = await setup_quiz_with_question(client, teacher_token, lesson["id"])

    await client.post(
        f"/lessons/{lesson['id']}/quiz/submit",
        json={"answers": [{"question_id": question["id"], "choice_id": correct["id"]}]},
        headers=auth_headers(student_token),
    )

    response = await client.get("/students/me/activity", headers=auth_headers(student_token))
    assert response.status_code == 200
    activity = response.json()
    assert isinstance(activity, list)
    assert len(activity) >= 1
