import httpx
from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies.auth import getCurrentUser
from app.schemas.code_execution import CodeExecutionRequest, CodeExecutionResponse
from app.services import code_execution_service

router = APIRouter(prefix="/execute", tags=["code-execution"])


@router.post("", response_model=CodeExecutionResponse)
async def executeCode(
    data: CodeExecutionRequest,
    _: dict = Depends(getCurrentUser),
):
    try:
        result = await code_execution_service.executeCode(data.language, data.code, data.stdin)
    except httpx.ConnectError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Impossible de contacter le service d'exécution. Vérifiez que Piston est démarré.",
        )
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Erreur du service d'exécution : {e.response.text}",
        )
    return result
