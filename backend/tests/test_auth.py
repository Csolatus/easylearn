import pytest


@pytest.mark.asyncio
async def test_register_success(client):
    response = await client.post("/auth/register", json={
        "first_name": "Test",
        "last_name": "User",
        "email": "test@example.com",
        "password": "securepassword",
        "role": "student",
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["role"] == "student"
    assert "id" in data


@pytest.mark.asyncio
async def test_register_duplicate_email(client):
    payload = {
        "first_name": "Test",
        "last_name": "User",
        "email": "duplicate@example.com",
        "password": "securepassword",
        "role": "student",
    }
    await client.post("/auth/register", json=payload)
    response = await client.post("/auth/register", json=payload)
    assert response.status_code == 409


@pytest.mark.asyncio
async def test_login_success(client):
    await client.post("/auth/register", json={
        "first_name": "Login",
        "last_name": "User",
        "email": "login@example.com",
        "password": "securepassword",
        "role": "teacher",
    })
    response = await client.post("/auth/login", json={
        "email": "login@example.com",
        "password": "securepassword",
    })
    assert response.status_code == 200
    assert "access_token" in response.json()


@pytest.mark.asyncio
async def test_login_wrong_password(client):
    await client.post("/auth/register", json={
        "first_name": "Wrong",
        "last_name": "Pass",
        "email": "wrongpass@example.com",
        "password": "securepassword",
        "role": "student",
    })
    response = await client.post("/auth/login", json={
        "email": "wrongpass@example.com",
        "password": "badpassword",
    })
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_register_weak_password(client):
    response = await client.post("/auth/register", json={
        "first_name": "Weak",
        "last_name": "Pass",
        "email": "weak@example.com",
        "password": "123",
        "role": "student",
    })
    assert response.status_code == 422
