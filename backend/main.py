import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.routers import agent, analytics, auth, classroom, code_execution, course, quiz, school, school_teacher, whitelist

app = FastAPI(title="EasyLearn API", version="0.1.0")

# CORS Security
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


app.include_router(auth.router)
app.include_router(agent.router)
app.include_router(school.router)
app.include_router(classroom.router)
app.include_router(course.router)
app.include_router(school_teacher.router)
app.include_router(whitelist.router)
app.include_router(quiz.router)
app.include_router(analytics.router)
app.include_router(code_execution.router)


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok"}
