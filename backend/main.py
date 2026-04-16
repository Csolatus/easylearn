from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import agent, auth, classroom, course, quiz, school, school_teacher, whitelist

app = FastAPI(title="EasyLearn API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(agent.router)
app.include_router(school.router)
app.include_router(classroom.router)
app.include_router(course.router)
app.include_router(school_teacher.router)
app.include_router(whitelist.router)
app.include_router(quiz.router)


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok"}
