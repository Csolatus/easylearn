import pytest

from tests.conftest import auth_headers


# ── Helpers ────────────────────────────────────────────────────────────────────

async def create_school(client, super_admin_token, name="Test School"):
    response = await client.post(
        "/schools",
        json={"name": name},
        headers=auth_headers(super_admin_token),
    )
    assert response.status_code == 201
    return response.json()


# ── School CRUD ────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_create_school(client, super_admin_token):
    school = await create_school(client, super_admin_token)
    assert school["name"] == "Test School"
    assert school["is_active"] is True
    assert "id" in school


@pytest.mark.asyncio
async def test_create_school_as_teacher_forbidden(client, teacher_token):
    response = await client.post(
        "/schools",
        json={"name": "Unauthorized School"},
        headers=auth_headers(teacher_token),
    )
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_create_school_as_student_forbidden(client, student_token):
    response = await client.post(
        "/schools",
        json={"name": "Unauthorized School"},
        headers=auth_headers(student_token),
    )
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_get_schools(client, super_admin_token):
    await create_school(client, super_admin_token, "School A")
    await create_school(client, super_admin_token, "School B")
    response = await client.get("/schools", headers=auth_headers(super_admin_token))
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 2


@pytest.mark.asyncio
async def test_get_school_by_id(client, super_admin_token):
    school = await create_school(client, super_admin_token, "Detail School")
    response = await client.get(
        f"/schools/{school['id']}", headers=auth_headers(super_admin_token)
    )
    assert response.status_code == 200
    assert response.json()["id"] == school["id"]


@pytest.mark.asyncio
async def test_update_school(client, super_admin_token, admin_token):
    school = await create_school(client, super_admin_token, "Old Name")
    response = await client.patch(
        f"/schools/{school['id']}",
        json={"name": "New Name"},
        headers=auth_headers(super_admin_token),
    )
    assert response.status_code == 200
    assert response.json()["name"] == "New Name"


# ── Suspend ────────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_suspend_school(client, super_admin_token):
    school = await create_school(client, super_admin_token, "To Suspend")
    response = await client.patch(
        f"/schools/{school['id']}/suspend",
        headers=auth_headers(super_admin_token),
    )
    assert response.status_code == 200
    assert response.json()["is_active"] is False


@pytest.mark.asyncio
async def test_suspend_school_as_admin_forbidden(client, super_admin_token, admin_token):
    school = await create_school(client, super_admin_token)
    response = await client.patch(
        f"/schools/{school['id']}/suspend",
        headers=auth_headers(admin_token),
    )
    assert response.status_code == 403


# ── Students listing ───────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_get_school_students(client, super_admin_token, admin_token):
    school = await create_school(client, super_admin_token)
    response = await client.get(
        f"/schools/{school['id']}/students",
        headers=auth_headers(super_admin_token),
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)
