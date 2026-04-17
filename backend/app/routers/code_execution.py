from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import getDb
from app.dependencies.auth import getCurrentUser, teacherOrAdmin
from app.schemas.code_execution import (
    CodeExecutionRequest,
    CodeExecutionResponse,
    PracticalExerciseCreate,
    PracticalExerciseResponse,
    PracticalExerciseUpdate,
)
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


@router.post("/lessons/{lesson_id}/exercise", response_model=PracticalExerciseResponse, status_code=status.HTTP_201_CREATED)
async def createExercise(
    lesson_id: str,
    data: PracticalExerciseCreate,
    _: dict = Depends(teacherOrAdmin),
    db: AsyncSession = Depends(getDb),
):
    existing = await db.execute(
        text("SELECT id FROM practical_exercises WHERE lesson_id = :lid"),
        {"lid": lesson_id},
    )
    if existing.fetchone():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Un exercice existe déjà pour cette leçon")
    result = await db.execute(
        text(
            "INSERT INTO practical_exercises (lesson_id, instructions, expected_output) "
            "VALUES (:lid, :instructions, :expected_output) "
            "RETURNING id, instructions, expected_output"
        ),
        {"lid": lesson_id, "instructions": data.instructions, "expected_output": data.expected_output},
    )
    await db.commit()
    row = result.fetchone()
    return {"id": str(row.id), "instructions": row.instructions, "expected_output": row.expected_output}


@router.patch("/lessons/{lesson_id}/exercise", response_model=PracticalExerciseResponse)
async def updateExercise(
    lesson_id: str,
    data: PracticalExerciseUpdate,
    _: dict = Depends(teacherOrAdmin),
    db: AsyncSession = Depends(getDb),
):
    existing = await db.execute(
        text("SELECT id, instructions, expected_output FROM practical_exercises WHERE lesson_id = :lid"),
        {"lid": lesson_id},
    )
    row = existing.fetchone()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Aucun exercice pour cette leçon")
    result = await db.execute(
        text(
            "UPDATE practical_exercises "
            "SET instructions = :instructions, expected_output = :expected_output "
            "WHERE lesson_id = :lid "
            "RETURNING id, instructions, expected_output"
        ),
        {
            "lid": lesson_id,
            "instructions": data.instructions if data.instructions is not None else row.instructions,
            "expected_output": data.expected_output if data.expected_output is not None else row.expected_output,
        },
    )
    await db.commit()
    updated = result.fetchone()
    return {"id": str(updated.id), "instructions": updated.instructions, "expected_output": updated.expected_output}


@router.delete("/lessons/{lesson_id}/exercise", status_code=status.HTTP_204_NO_CONTENT)
async def deleteExercise(
    lesson_id: str,
    _: dict = Depends(teacherOrAdmin),
    db: AsyncSession = Depends(getDb),
):
    result = await db.execute(
        text("DELETE FROM practical_exercises WHERE lesson_id = :lid RETURNING id"),
        {"lid": lesson_id},
    )
    await db.commit()
    if not result.fetchone():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Aucun exercice pour cette leçon")


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
