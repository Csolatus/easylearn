import pytest

from tests.conftest import auth_headers, _register_and_login


# ── Helpers ────────────────────────────────────────────────────────────────────

async def create_school(client, super_admin_token, name="Invite School"):
    response = await client.post(
        "/schools",
        json={"name": name},
        headers=auth_headers(super_admin_token),
    )
    assert response.status_code == 201
    return response.json()


async def register_teacher(client, email="invited_teacher@example.com"):
    await client.post("/auth/register", json={
        "first_name": "Invited",
        "last_name": "Teacher",
        "email": email,
        "password": "securepassword",
        "role": "teacher",
    })
    response = await client.post("/auth/login", json={
        "email": email,
        "password": "securepassword",
    })
    return response.json()["access_token"]


# ── Invitations ────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_invite_teacher(client, super_admin_token):
    school = await create_school(client, super_admin_token)
    teacher_token = await register_teacher(client)

    response = await client.post(
        f"/schools/{school['id']}/invite",
        json={"teacher_email": "invited_teacher@example.com"},
        headers=auth_headers(super_admin_token),
    )
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "invited"
    assert data["school_id"] == school["id"]


@pytest.mark.asyncio
async def test_invite_nonexistent_teacher(client, super_admin_token):
    school = await create_school(client, super_admin_token, "No Teacher School")
    response = await client.post(
        f"/schools/{school['id']}/invite",
        json={"teacher_email": "doesnotexist@example.com"},
        headers=auth_headers(super_admin_token),
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_my_invitations(client, super_admin_token):
    school = await create_school(client, super_admin_token, "Invitations School")
    teacher_token = await register_teacher(client, "invited2@example.com")

    await client.post(
        f"/schools/{school['id']}/invite",
        json={"teacher_email": "invited2@example.com"},
        headers=auth_headers(super_admin_token),
    )

    response = await client.get("/my-invitations", headers=auth_headers(teacher_token))
    assert response.status_code == 200
    invitations = response.json()
    assert isinstance(invitations, list)
    assert len(invitations) == 1
    assert invitations[0]["status"] == "invited"


@pytest.mark.asyncio
async def test_accept_invitation(client, super_admin_token):
    school = await create_school(client, super_admin_token, "Accept School")
    teacher_token = await register_teacher(client, "accept_teacher@example.com")

    invitation = (await client.post(
        f"/schools/{school['id']}/invite",
        json={"teacher_email": "accept_teacher@example.com"},
        headers=auth_headers(super_admin_token),
    )).json()

    response = await client.patch(
        f"/school-teachers/{invitation['id']}/accept",
        headers=auth_headers(teacher_token),
    )
    assert response.status_code == 200
    assert response.json()["status"] == "active"


@pytest.mark.asyncio
async def test_decline_invitation(client, super_admin_token):
    school = await create_school(client, super_admin_token, "Decline School")
    teacher_token = await register_teacher(client, "decline_teacher@example.com")

    invitation = (await client.post(
        f"/schools/{school['id']}/invite",
        json={"teacher_email": "decline_teacher@example.com"},
        headers=auth_headers(super_admin_token),
    )).json()

    response = await client.patch(
        f"/school-teachers/{invitation['id']}/decline",
        headers=auth_headers(teacher_token),
    )
    assert response.status_code == 204


@pytest.mark.asyncio
async def test_suspend_teacher(client, super_admin_token):
    school = await create_school(client, super_admin_token, "Suspend School")
    teacher_token = await register_teacher(client, "suspend_teacher@example.com")

    invitation = (await client.post(
        f"/schools/{school['id']}/invite",
        json={"teacher_email": "suspend_teacher@example.com"},
        headers=auth_headers(super_admin_token),
    )).json()

    await client.patch(
        f"/school-teachers/{invitation['id']}/accept",
        headers=auth_headers(teacher_token),
    )

    response = await client.patch(
        f"/school-teachers/{invitation['id']}/suspend",
        headers=auth_headers(super_admin_token),
    )
    assert response.status_code == 200
    assert response.json()["status"] == "suspended"


@pytest.mark.asyncio
async def test_get_school_teachers(client, super_admin_token):
    school = await create_school(client, super_admin_token, "Teachers List School")
    teacher_token = await register_teacher(client, "listed_teacher@example.com")

    invitation = (await client.post(
        f"/schools/{school['id']}/invite",
        json={"teacher_email": "listed_teacher@example.com"},
        headers=auth_headers(super_admin_token),
    )).json()

    await client.patch(
        f"/school-teachers/{invitation['id']}/accept",
        headers=auth_headers(teacher_token),
    )

    response = await client.get(
        f"/schools/{school['id']}/teachers",
        headers=auth_headers(super_admin_token),
    )
    assert response.status_code == 200
    teachers = response.json()
    assert isinstance(teachers, list)
    assert len(teachers) >= 1


@pytest.mark.asyncio
async def test_invite_teacher_as_student_forbidden(client, super_admin_token, student_token):
    school = await create_school(client, super_admin_token, "Forbidden School")
    response = await client.post(
        f"/schools/{school['id']}/invite",
        json={"teacher_email": "someone@example.com"},
        headers=auth_headers(student_token),
    )
    assert response.status_code == 403
