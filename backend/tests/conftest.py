import os

import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool

from app.database import getDb
from main import app

DATABASE_URL = os.environ["DATABASE_URL"].replace(
    "postgresql://", "postgresql+asyncpg://"
)

engine = create_async_engine(DATABASE_URL, echo=False, poolclass=NullPool)
TestSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


async def overrideGetDb():
    async with TestSessionLocal() as session:
        yield session


app.dependency_overrides[getDb] = overrideGetDb


@pytest_asyncio.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as c:
        yield c


async def _register_and_login(client: AsyncClient, email: str, role: str) -> str:
    await client.post("/auth/register", json={
        "first_name": "Test",
        "last_name": role.capitalize(),
        "email": email,
        "password": "securepassword",
        "role": role,
    })
    response = await client.post("/auth/login", json={
        "email": email,
        "password": "securepassword",
    })
    return response.json()["access_token"]


@pytest_asyncio.fixture
async def student_token(client):
    return await _register_and_login(client, "student_fixture@example.com", "student")


@pytest_asyncio.fixture
async def teacher_token(client):
    return await _register_and_login(client, "teacher_fixture@example.com", "teacher")


@pytest_asyncio.fixture
async def admin_token(client):
    return await _register_and_login(client, "admin_fixture@example.com", "school_admin")


@pytest_asyncio.fixture
async def super_admin_token(client):
    return await _register_and_login(client, "superadmin_fixture@example.com", "super_admin")


def auth_headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}
