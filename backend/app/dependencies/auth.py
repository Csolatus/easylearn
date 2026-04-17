from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import getDb
from app.services.auth_service import ALGORITHM, SECRET_KEY, isTokenRevoked

bearer_scheme = HTTPBearer(auto_error=False)


async def getCurrentUser(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: AsyncSession = Depends(getDb),
) -> dict:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token manquant",
            headers={"WWW-Authenticate": "Bearer"},
        )
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


async def getSchoolContext(
    x_school_id: str | None = Header(default=None, alias="X-School-ID"),
    user: dict = Depends(getCurrentUser),
    db: AsyncSession = Depends(getDb),
) -> str | None:
    """Valide le header X-School-ID et vérifie que l'utilisateur est membre actif de l'école.
    Retourne le school_id validé, ou None si le header est absent.
    Les super_admin ont un accès global sans vérification de membership."""
    if x_school_id is None:
        return None

    if user["role"] == "super_admin":
        return x_school_id

    result = await db.execute(
        text(
            "SELECT 1 FROM school_teachers "
            "WHERE school_id = :school_id AND teacher_id = :user_id AND status = 'active'"
        ),
        {"school_id": x_school_id, "user_id": user["id"]},
    )
    if result.fetchone() is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous n'êtes pas membre actif de cette école",
        )
    return x_school_id
