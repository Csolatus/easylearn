import uuid
from datetime import datetime, timedelta, timezone

import bcrypt
from jose import jwt

from app.schemas.auth import RegisterRequest

# --- Config JWT (à déplacer dans un fichier .env plus tard) ---
SECRET_KEY = "change-me-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Stockage en mémoire — remplacé par PostgreSQL quand la DB sera prête
_users: dict[str, dict] = {}
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


def registerUser(data: RegisterRequest) -> dict:
    if any(u["email"] == data.email for u in _users.values()):
        return None

    user_id = str(uuid.uuid4())
    _users[user_id] = {
        "id": user_id,
        "first_name": data.first_name,
        "last_name": data.last_name,
        "email": data.email,
        "role": data.role,
        "hashed_password": hashPassword(data.password),
    }
    return _users[user_id]


def loginUser(email: str, password: str) -> str | None:
    user = next((u for u in _users.values() if u["email"] == email), None)
    if not user or not verifyPassword(password, user["hashed_password"]):
        return None

    return createAccessToken({"sub": user["id"], "email": user["email"]})


def logoutUser(token: str) -> None:
    _blacklist.add(token)


def isTokenRevoked(token: str) -> bool:
    return token in _blacklist
