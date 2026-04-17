import pytest

from tests.conftest import auth_headers


# ── Helpers ────────────────────────────────────────────────────────────────────

async def create_course(client, token, title="Test Course", visibility="public"):
    response = await client.post(
        "/courses",
        json={"title": title, "visibility": visibility},
        headers=auth_headers(token),
    )
    assert response.status_code == 201
    return response.json()


async def create_lesson(client, token, course_id, title="Lesson 1", ordre=1):
    response = await client.post(
        f"/courses/{course_id}/lessons",
        json={"title": title, "ordre": ordre},
        headers=auth_headers(token),
    )
    assert response.status_code == 201
    return response.json()


# ── Course CRUD ────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_create_course_as_teacher(client, teacher_token):
    course = await create_course(client, teacher_token)
    assert course["title"] == "Test Course"
    assert course["visibility"] == "public"
    assert "id" in course


@pytest.mark.asyncio
async def test_create_course_as_student_forbidden(client, student_token):
    response = await client.post(
        "/courses",
        json={"title": "Unauthorized", "visibility": "public"},
        headers=auth_headers(student_token),
    )
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_get_courses(client, teacher_token, student_token):
    await create_course(client, teacher_token, title="Visible Course")
    response = await client.get("/courses", headers=auth_headers(student_token))
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_get_course_by_id(client, teacher_token):
    course = await create_course(client, teacher_token, title="Get By ID")
    response = await client.get(
        f"/courses/{course['id']}", headers=auth_headers(teacher_token)
    )
    assert response.status_code == 200
    assert response.json()["id"] == course["id"]


@pytest.mark.asyncio
async def test_update_course(client, teacher_token):
    course = await create_course(client, teacher_token, title="Old Title")
    response = await client.patch(
        f"/courses/{course['id']}",
        json={"title": "New Title"},
        headers=auth_headers(teacher_token),
    )
    assert response.status_code == 200
    assert response.json()["title"] == "New Title"


@pytest.mark.asyncio
async def test_delete_course(client, teacher_token):
    course = await create_course(client, teacher_token, title="To Delete")
    response = await client.delete(
        f"/courses/{course['id']}", headers=auth_headers(teacher_token)
    )
    assert response.status_code == 204


@pytest.mark.asyncio
async def test_course_visibility_private(client, teacher_token):
    course = await create_course(client, teacher_token, title="Private Course", visibility="private")
    assert course["visibility"] == "private"


# ── Lesson CRUD ────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_create_lesson(client, teacher_token):
    course = await create_course(client, teacher_token)
    lesson = await create_lesson(client, teacher_token, course["id"])
    assert lesson["title"] == "Lesson 1"
    assert lesson["course_id"] == course["id"]
    assert "id" in lesson


@pytest.mark.asyncio
async def test_create_lesson_with_content(client, teacher_token):
    course = await create_course(client, teacher_token)
    response = await client.post(
        f"/courses/{course['id']}/lessons",
        json={"title": "Rich Lesson", "docs": "# Hello\nThis is content.", "ordre": 1},
        headers=auth_headers(teacher_token),
    )
    assert response.status_code == 201
    assert response.json()["docs"] == "# Hello\nThis is content."


@pytest.mark.asyncio
async def test_get_lessons(client, teacher_token, student_token):
    course = await create_course(client, teacher_token)
    await create_lesson(client, teacher_token, course["id"], "L1", 1)
    await create_lesson(client, teacher_token, course["id"], "L2", 2)
    response = await client.get(
        f"/courses/{course['id']}/lessons", headers=auth_headers(student_token)
    )
    assert response.status_code == 200
    assert len(response.json()) == 2


@pytest.mark.asyncio
async def test_get_lesson_by_id(client, teacher_token):
    course = await create_course(client, teacher_token)
    lesson = await create_lesson(client, teacher_token, course["id"])
    response = await client.get(
        f"/courses/{course['id']}/lessons/{lesson['id']}",
        headers=auth_headers(teacher_token),
    )
    assert response.status_code == 200
    assert response.json()["id"] == lesson["id"]


@pytest.mark.asyncio
async def test_update_lesson(client, teacher_token):
    course = await create_course(client, teacher_token)
    lesson = await create_lesson(client, teacher_token, course["id"])
    response = await client.patch(
        f"/courses/{course['id']}/lessons/{lesson['id']}",
        json={"title": "Updated Lesson"},
        headers=auth_headers(teacher_token),
    )
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Lesson"


@pytest.mark.asyncio
async def test_delete_lesson(client, teacher_token):
    course = await create_course(client, teacher_token)
    lesson = await create_lesson(client, teacher_token, course["id"])
    response = await client.delete(
        f"/courses/{course['id']}/lessons/{lesson['id']}",
        headers=auth_headers(teacher_token),
    )
    assert response.status_code == 204


@pytest.mark.asyncio
async def test_create_lesson_as_student_forbidden(client, teacher_token, student_token):
    course = await create_course(client, teacher_token)
    response = await client.post(
        f"/courses/{course['id']}/lessons",
        json={"title": "Unauthorized Lesson", "ordre": 1},
        headers=auth_headers(student_token),
    )
    assert response.status_code == 403
