from fastapi import APIRouter, Depends

from app.dependencies.auth import getCurrentUser
from app.schemas.code_execution import CodeExecutionRequest, CodeExecutionResponse
from app.services import code_execution_service

router = APIRouter(prefix="/execute", tags=["code-execution"])


@router.post("", response_model=CodeExecutionResponse)
async def executeCode(
    data: CodeExecutionRequest,
    _: dict = Depends(getCurrentUser),
):
    return await code_execution_service.executeCode(data.language, data.code, data.stdin)
