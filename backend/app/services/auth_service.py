import os
from datetime import datetime, timedelta, timezone

import bcrypt
from dotenv import load_dotenv
from jose import jwt
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.auth import RegisterRequest

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))

_blacklist: set[str] = set()


def hashPassword(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verifyPassword(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def createAccessToken(data: dict) -> str:
    payload = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload.update({"exp": expire})
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


async def registerUser(data: RegisterRequest, db: AsyncSession) -> dict | None:
    result = await db.execute(
        text("SELECT id FROM users WHERE email = :email"),
        {"email": data.email},
    )
    if result.fetchone():
        return None

    result = await db.execute(
        text(
            "INSERT INTO users (first_name, last_name, email, password, role) "
            "VALUES (:first_name, :last_name, :email, :password, :role) "
            "RETURNING id, first_name, last_name, email, role"
        ),
        {
            "first_name": data.first_name,
            "last_name": data.last_name,
            "email": data.email,
            "password": hashPassword(data.password),
            "role": data.role.value,
        },
    )
    await db.commit()
    row = result.fetchone()
    return {
        "id": str(row.id),
        "first_name": row.first_name,
        "last_name": row.last_name,
        "email": row.email,
        "role": row.role,
    }


async def loginUser(email: str, password: str, db: AsyncSession) -> str | None:
    result = await db.execute(
        text("SELECT id, email, password, role FROM users WHERE email = :email"),
        {"email": email},
    )
    row = result.fetchone()
    if not row or not verifyPassword(password, row.password):
        return None

    return createAccessToken({"sub": str(row.id), "email": row.email, "role": row.role})


def logoutUser(token: str) -> None:
    _blacklist.add(token)


def isTokenRevoked(token: str) -> bool:
    return token in _blacklist
