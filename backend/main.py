from fastapi import FastAPI
from app.routers import auth, agent

app = FastAPI(title="EasyLearn API", version="0.1.0")

app.include_router(auth.router)
app.include_router(agent.router)
