import os

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, status
import httpx

from app.schemas.agent import AgentRequest, AgentResponse

load_dotenv()

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "localhost")
OLLAMA_URL = f"http://{OLLAMA_HOST}:11434/api/chat"
MODEL_NAME = os.getenv("OLLAMA_MODEL")

router = APIRouter(prefix="/agent", tags=["agent"])


@router.post("/chat", response_model=AgentResponse)
async def chat_with_agent(request: AgentRequest) -> AgentResponse:
    payload = {
        "model": MODEL_NAME,
        "messages": [{"role": "user", "content": request.message}],
        "stream": False,
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            res = await client.post(OLLAMA_URL, json=payload)
            res.raise_for_status()
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

    data = res.json()
    response_text = data["message"]["content"]

    return AgentResponse(response=response_text)
