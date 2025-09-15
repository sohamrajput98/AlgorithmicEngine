from fastapi import FastAPI
from pathlib import Path
from fastapi.staticfiles import StaticFiles
from .config import settings

# Import routers from endpoints
from app.api.endpoints import (
    health,
    auth,
    users,
    accounts,
    problems,
    testcases,
    submissions,
    badges,
    admin,
)

app = FastAPI(
    title="AlgorithmicEngine Backend",
    description="API for AlgorithmicEngine project - supports problems, submissions, badges, and more.",
    version="1.0.0",
)

# Include routers
app.include_router(health.router)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(accounts.router)
app.include_router(problems.router)
app.include_router(testcases.router)
app.include_router(submissions.router)
app.include_router(badges.router)
app.include_router(admin.router)

# Mount static files (e.g., badges, logos)

static_path = Path(__file__).resolve().parent.parent / "static"
app.mount("/static", StaticFiles(directory=static_path), name="static")

@app.get("/")
async def root():
    return {"message": "Welcome to AlgorithmicEngine API"}
