from pydantic import BaseModel, field_validator


SUPPORTED_LANGUAGES = {"python", "javascript"}


class CodeExecutionRequest(BaseModel):
    code: str
    language: str = "python"
    stdin: str = ""

    @field_validator("language")
    @classmethod
    def validateLanguage(cls, v: str) -> str:
        if v not in SUPPORTED_LANGUAGES:
            raise ValueError(f"Langage non supporté : {v}. Langages disponibles : {sorted(SUPPORTED_LANGUAGES)}")
        return v


class CodeExecutionResponse(BaseModel):
    language: str
    stdout: str
    stderr: str
    exit_code: int | None
