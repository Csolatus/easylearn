from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import getDb
from app.dependencies.auth import getCurrentUser
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserResponse
from app.services import auth_service

bearer_scheme = HTTPBearer()
limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def register(request: Request, data: RegisterRequest, db: AsyncSession = Depends(getDb)):
    user = await auth_service.registerUser(data, db)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Un compte existe déjà avec cet email",
        )
    return user


@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")
async def login(request: Request, data: LoginRequest, db: AsyncSession = Depends(getDb)):
    token = await auth_service.loginUser(data.email, data.password, db)
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserResponse)
async def getMe(user: dict = Depends(getCurrentUser)):
    return user


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    token = credentials.credentials
    if auth_service.isTokenRevoked(token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token déjà invalidé",
        )
    auth_service.logoutUser(token)
