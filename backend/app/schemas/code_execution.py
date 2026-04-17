from pydantic import BaseModel, field_validator


SUPPORTED_LANGUAGES = {"python", "javascript"}


class CodeExecutionRequest(BaseModel):
    code: str
    language: str = "python"
    stdin: str = ""
    exercise_id: str | None = None

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
    success: bool | None = None


class PracticalExerciseResponse(BaseModel):
    id: str
    instructions: str
    expected_output: str
