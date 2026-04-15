from fastapi import FastAPI

from app.routers import auth, classroom, course, school, school_teacher, whitelist, agent

app = FastAPI(title="EasyLearn API", version="0.1.0")

app.include_router(auth.router)
app.include_router(agent.router)
app.include_router(school.router)
app.include_router(classroom.router)
app.include_router(course.router)
app.include_router(school_teacher.router)
app.include_router(whitelist.router)
