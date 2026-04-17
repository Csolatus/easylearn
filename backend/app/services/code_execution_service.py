import asyncio
import subprocess
import sys

LANGUAGE_COMMANDS = {
    "python": [sys.executable, "-c"],
    "javascript": ["node", "-e"],
}

TIMEOUT_SECONDS = 5


async def executeCode(language: str, code: str, stdin: str = "") -> dict:
    cmd_base = LANGUAGE_COMMANDS.get(language)
    if cmd_base is None:
        return {"language": language, "stdout": "", "stderr": f"Langage non supporté : {language}", "exit_code": 1}

    cmd = cmd_base + [code]

    try:
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        stdout, stderr = await asyncio.wait_for(
            process.communicate(input=stdin.encode() if stdin else None),
            timeout=TIMEOUT_SECONDS,
        )
        return {
            "language": language,
            "stdout": stdout.decode(errors="replace"),
            "stderr": stderr.decode(errors="replace"),
            "exit_code": process.returncode,
        }
    except asyncio.TimeoutError:
        process.kill()
        return {"language": language, "stdout": "", "stderr": "Timeout : exécution dépassée (5s)", "exit_code": 1}
    except FileNotFoundError:
        return {"language": language, "stdout": "", "stderr": f"Runtime introuvable pour {language}", "exit_code": 1}


async def checkHealth() -> bool:
    for lang, cmd_base in LANGUAGE_COMMANDS.items():
        try:
            result = subprocess.run(
                cmd_base + ["1+1"],
                capture_output=True,
                timeout=3,
            )
            if result.returncode != 0:
                return False
        except (FileNotFoundError, subprocess.TimeoutExpired):
            return False
    return True
