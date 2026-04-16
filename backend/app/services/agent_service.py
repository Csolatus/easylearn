import os
from uuid import UUID

import httpx
from dotenv import load_dotenv
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

load_dotenv()

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_URL = f"{OLLAMA_BASE_URL}/api/chat"
MODEL_NAME = os.getenv("OLLAMA_MODEL", "")
SYSTEM_PROMPT = os.getenv("OLLAMA_SYSTEM_PROMPT", "")


async def createConversation(db: AsyncSession, student_id: UUID) -> UUID:
    result = await db.execute(
        text(
            "INSERT INTO conversations (student_id) VALUES (:student_id) RETURNING id"
        ),
        {"student_id": str(student_id)},
    )
    await db.commit()
    return result.fetchone().id


async def conversationExists(db: AsyncSession, conversation_id: UUID) -> bool:
    result = await db.execute(
        text("SELECT 1 FROM conversations WHERE id = :id"),
        {"id": str(conversation_id)},
    )
    return result.fetchone() is not None


async def getHistory(db: AsyncSession, conversation_id: UUID) -> list[dict]:
    result = await db.execute(
        text(
            "SELECT prompt, output FROM ai_generations "
            "WHERE conversation_id = :conversation_id AND output IS NOT NULL "
            "ORDER BY created_at ASC"
        ),
        {"conversation_id": str(conversation_id)},
    )
    history = []
    for row in result.fetchall():
        history.append({"role": "user", "content": row.prompt})
        history.append({"role": "assistant", "content": row.output})
    return history


async def saveExchange(
    db: AsyncSession,
    conversation_id: UUID,
    student_id: UUID,
    prompt: str,
    output: str,
) -> None:
    await db.execute(
        text(
            "INSERT INTO ai_generations (conversation_id, student_id, prompt, output, pending) "
            "VALUES (:conversation_id, :student_id, :prompt, :output, FALSE)"
        ),
        {
            "conversation_id": str(conversation_id),
            "student_id": str(student_id),
            "prompt": prompt,
            "output": output,
        },
    )
    await db.commit()


async def getMessages(db: AsyncSession, conversation_id: UUID) -> list[dict]:
    result = await db.execute(
        text(
            "SELECT id, prompt, output, created_at FROM ai_generations "
            "WHERE conversation_id = :conversation_id "
            "ORDER BY created_at ASC"
        ),
        {"conversation_id": str(conversation_id)},
    )
    return [
        {
            "id": row.id,
            "prompt": row.prompt,
            "output": row.output,
            "created_at": row.created_at,
        }
        for row in result.fetchall()
    ]


async def getExerciseInstructions(db: AsyncSession, exercise_id: UUID) -> dict | None:
    result = await db.execute(
        text("SELECT id, instructions FROM practical_exercises WHERE id = :id"),
        {"id": str(exercise_id)},
    )
    row = result.fetchone()
    if not row:
        return None
    return {"exercise_id": row.id, "instructions": row.instructions}


async def askOllama(history: list[dict], user_message: str) -> str:
    messages = []
    if SYSTEM_PROMPT:
        messages.append({"role": "system", "content": SYSTEM_PROMPT})
    messages.extend(history)
    messages.append({"role": "user", "content": user_message})

    payload = {"model": MODEL_NAME, "messages": messages, "stream": False}

    async with httpx.AsyncClient(timeout=60.0) as client:
        res = await client.post(OLLAMA_URL, json=payload)
        res.raise_for_status()

    return res.json()["message"]["content"]


async def checkHealth() -> bool:
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            res = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            return res.status_code == 200
    except httpx.ConnectError:
        return False
