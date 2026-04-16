import os

import httpx
from dotenv import load_dotenv

load_dotenv()

PISTON_BASE_URL = os.getenv("PISTON_API_URL", "http://localhost:2000")
PISTON_EXECUTE_URL = f"{PISTON_BASE_URL}/api/v2/execute"


async def executeCode(language: str, code: str, stdin: str = "") -> dict:
    payload = {
        "language": language,
        "version": "*",
        "files": [{"content": code}],
        "stdin": stdin,
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        res = await client.post(PISTON_EXECUTE_URL, json=payload)
        res.raise_for_status()

    data = res.json()
    run = data.get("run", {})

    return {
        "language": data.get("language", language),
        "stdout": run.get("stdout", ""),
        "stderr": run.get("stderr", ""),
        "exit_code": run.get("code"),
    }


async def checkHealth() -> bool:
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            res = await client.get(f"{PISTON_BASE_URL}/api/v2/runtimes")
            return res.status_code == 200
    except httpx.ConnectError:
        return False