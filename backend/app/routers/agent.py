import json
from uuid import UUID

import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import getDb
from app.schemas.agent import (
    ChatRequest,
    ChatResponse,
    ConversationRequest,
    ConversationResponse,
    ExchangeResponse,
    ExerciseInstructionsResponse,
    HealthResponse,
)
from app.services import agent_service

router = APIRouter(prefix="/agent", tags=["agent"])


@router.post(
    "/conversations",
    response_model=ConversationResponse,
    status_code=status.HTTP_201_CREATED,
)
async def createConversation(
    request: ConversationRequest,
    db: AsyncSession = Depends(getDb),
):
    conversation_id = await agent_service.createConversation(db, request.student_id)
    return ConversationResponse(conversation_id=conversation_id)


@router.post(
    "/conversations/{conversation_id}/chat",
    response_model=ChatResponse,
)
async def chat(
    conversation_id: UUID,
    request: ChatRequest,
    db: AsyncSession = Depends(getDb),
):
    if not await agent_service.conversationExists(db, conversation_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation introuvable.",
        )

    history = await agent_service.getHistory(db, conversation_id)

    try:
        response_text = await agent_service.askOllama(history, request.message)
    except httpx.ConnectError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Impossible de contacter l'agent IA. Vérifiez qu'Ollama est démarré.",
        )
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Erreur de l'agent IA : {e.response.text}",
        )

    await agent_service.saveExchange(
        db, conversation_id, request.student_id, request.message, response_text
    )

    return ChatResponse(response=response_text, conversation_id=conversation_id)


@router.post("/conversations/{conversation_id}/stream")
async def chatStream(
    conversation_id: UUID,
    request: ChatRequest,
    db: AsyncSession = Depends(getDb),
):
    if not await agent_service.conversationExists(db, conversation_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation introuvable.",
        )

    history = await agent_service.getHistory(db, conversation_id)

    async def event_generator():
        full_response = ""
        try:
            async for token in agent_service.askOllamaStream(history, request.message):
                full_response += token
                yield f"data: {json.dumps({'token': token})}\n\n"
        except (httpx.ConnectError, httpx.HTTPStatusError):
            yield f"data: {json.dumps({'error': 'Agent IA indisponible'})}\n\n"
            return
        finally:
            if full_response:
                await agent_service.saveExchange(
                    db, conversation_id, request.student_id, request.message, full_response
                )
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.get(
    "/conversations/{conversation_id}/messages",
    response_model=list[ExchangeResponse],
)
async def getMessages(
    conversation_id: UUID,
    db: AsyncSession = Depends(getDb),
):
    if not await agent_service.conversationExists(db, conversation_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation introuvable.",
        )

    return await agent_service.getMessages(db, conversation_id)


@router.get(
    "/exercises/{exercise_id}/instructions",
    response_model=ExerciseInstructionsResponse,
)
async def getExerciseInstructions(
    exercise_id: UUID,
    db: AsyncSession = Depends(getDb),
):
    instructions = await agent_service.getExerciseInstructions(db, exercise_id)
    if not instructions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercice introuvable.",
        )
    return instructions


@router.get("/health", response_model=HealthResponse)
async def health():
    ok = await agent_service.checkHealth()
    return HealthResponse(
        status="ok" if ok else "unavailable",
        model=agent_service.MODEL_NAME,
    )
