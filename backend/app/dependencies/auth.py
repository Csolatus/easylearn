from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import getDb
from app.services.auth_service import ALGORITHM, SECRET_KEY, isTokenRevoked

bearer_scheme = HTTPBearer()


async def getCurrentUser(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: AsyncSession = Depends(getDb),
) -> dict:
    token = credentials.credentials

    if isTokenRevoked(token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token révoqué",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise ValueError
    except (JWTError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide",
            headers={"WWW-Authenticate": "Bearer"},
        )

    result = await db.execute(
        text("SELECT id, first_name, last_name, email, role FROM users WHERE id = :id"),
        {"id": user_id},
    )
    user = result.fetchone()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Utilisateur introuvable",
        )

    return {
        "id": str(user.id),
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "role": user.role,
    }


def requireRoles(*roles: str):
    async def checker(user: dict = Depends(getCurrentUser)) -> dict:
        if user["role"] not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Accès refusé",
            )
        return user
    return checker


# Dépendances prêtes à l'emploi
studentOnly    = requireRoles("student")
teacherOnly    = requireRoles("teacher")
schoolAdminOnly = requireRoles("school_admin")
superAdminOnly  = requireRoles("super_admin")
teacherOrAdmin  = requireRoles("teacher", "school_admin", "super_admin")
