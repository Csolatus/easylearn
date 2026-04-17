import pytest

from tests.conftest import auth_headers


# ── Helpers ────────────────────────────────────────────────────────────────────

async def create_classroom(client, token, name="My Class", school_id=None):
    payload = {"name": name}
    if school_id:
        payload["school_id"] = school_id
    response = await client.post(
        "/classrooms",
        json=payload,
        headers=auth_headers(token),
    )
    assert response.status_code == 201
    return response.json()


async def create_course(client, token, title="Course"):
    response = await client.post(
        "/courses",
        json={"title": title, "visibility": "public"},
        headers=auth_headers(token),
    )
    assert response.status_code == 201
    return response.json()


# ── Classroom CRUD ─────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_create_classroom(client, teacher_token):
    classroom = await create_classroom(client, teacher_token, name="Test Class")
    assert classroom["name"] == "Test Class"
    assert "id" in classroom
    assert "invite_code" in classroom
    assert classroom["is_archived"] is False


@pytest.mark.asyncio
async def test_create_classroom_as_student_forbidden(client, student_token):
    response = await client.post(
        "/classrooms",
        json={"name": "Unauthorized"},
        headers=auth_headers(student_token),
    )
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_get_classrooms(client, teacher_token):
    await create_classroom(client, teacher_token, "Class A")
    await create_classroom(client, teacher_token, "Class B")
    response = await client.get("/classrooms", headers=auth_headers(teacher_token))
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 2


@pytest.mark.asyncio
async def test_get_classroom_by_id(client, teacher_token):
    classroom = await create_classroom(client, teacher_token, "Detail Class")
    response = await client.get(
        f"/classrooms/{classroom['id']}", headers=auth_headers(teacher_token)
    )
    assert response.status_code == 200
    assert response.json()["id"] == classroom["id"]


@pytest.mark.asyncio
async def test_update_classroom(client, teacher_token):
    classroom = await create_classroom(client, teacher_token, "Old Name")
    response = await client.patch(
        f"/classrooms/{classroom['id']}",
        json={"name": "New Name"},
        headers=auth_headers(teacher_token),
    )
    assert response.status_code == 200
    assert response.json()["name"] == "New Name"


# ── Archiving ──────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_archive_classroom(client, teacher_token):
    classroom = await create_classroom(client, teacher_token, "To Archive")
    response = await client.patch(
        f"/classrooms/{classroom['id']}/archive",
        headers=auth_headers(teacher_token),
    )
    assert response.status_code == 200
    assert response.json()["is_archived"] is True


# ── Course assignment ──────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_add_course_to_classroom(client, teacher_token):
    classroom = await create_classroom(client, teacher_token)
    course = await create_course(client, teacher_token)
    response = await client.post(
        f"/classrooms/{classroom['id']}/courses",
        params={"course_id": course["id"]},
        headers=auth_headers(teacher_token),
    )
    assert response.status_code == 204


@pytest.mark.asyncio
async def test_remove_course_from_classroom(client, teacher_token):
    classroom = await create_classroom(client, teacher_token)
    course = await create_course(client, teacher_token)
    await client.post(
        f"/classrooms/{classroom['id']}/courses",
        params={"course_id": course["id"]},
        headers=auth_headers(teacher_token),
    )
    response = await client.delete(
        f"/classrooms/{classroom['id']}/courses/{course['id']}",
        headers=auth_headers(teacher_token),
    )
    assert response.status_code == 204


@pytest.mark.asyncio
async def test_invite_code_is_unique(client, teacher_token):
    c1 = await create_classroom(client, teacher_token, "Class X")
    c2 = await create_classroom(client, teacher_token, "Class Y")
    assert c1["invite_code"] != c2["invite_code"]
