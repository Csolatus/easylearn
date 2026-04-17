from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import getDb
from app.dependencies.auth import getCurrentUser
from app.schemas.code_execution import CodeExecutionRequest, CodeExecutionResponse, PracticalExerciseResponse
from app.services import code_execution_service

router = APIRouter(tags=["code-execution"])


@router.get("/lessons/{lesson_id}/exercise", response_model=PracticalExerciseResponse)
async def getExercise(
    lesson_id: str,
    _: dict = Depends(getCurrentUser),
    db: AsyncSession = Depends(getDb),
):
    row = await db.execute(
        text("SELECT id, instructions, expected_output FROM practical_exercises WHERE lesson_id = :lid"),
        {"lid": lesson_id},
    )
    exercise = row.fetchone()
    if not exercise:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Aucun exercice pratique pour cette leçon")
    return {"id": str(exercise[0]), "instructions": exercise[1], "expected_output": exercise[2]}


@router.post("/execute", response_model=CodeExecutionResponse)
async def executeCode(
    data: CodeExecutionRequest,
    _: dict = Depends(getCurrentUser),
    db: AsyncSession = Depends(getDb),
):
    result = await code_execution_service.executeCode(data.language, data.code, data.stdin)

    if data.exercise_id:
        row = await db.execute(
            text("SELECT expected_output FROM practical_exercises WHERE id = :id"),
            {"id": data.exercise_id},
        )
        exercise = row.fetchone()
        if exercise:
            expected = exercise[0].strip()
            actual = result["stdout"].strip()
            result["success"] = actual == expected

    return result
