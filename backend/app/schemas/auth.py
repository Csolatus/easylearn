from enum import Enum

from pydantic import BaseModel, EmailStr, field_validator


class Role(str, Enum):
    student = "student"
    teacher = "teacher"
    school_admin = "school_admin"
    super_admin = "super_admin"


class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    role: Role

    @field_validator("first_name", "last_name")
    @classmethod
    def notEmpty(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Ce champ ne peut pas être vide")
        return value.strip()

    @field_validator("password")
    @classmethod
    def passwordStrength(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Le mot de passe doit contenir au moins 8 caractères")
        return value


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    role: Role
