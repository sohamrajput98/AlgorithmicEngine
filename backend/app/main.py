from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from fastapi.staticfiles import StaticFiles
from .config import settings
from .config import FRONTEND_URL
import os

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
    analytics,
    admin,
)

app = FastAPI(
    title="AlgorithmicEngine Backend",
    description="API for AlgorithmicEngine project - supports problems, submissions, badges, and more.",
    version="1.0.0",
)

# CORS middleware (keep dev server open)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],  # uses env variable
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
app.include_router(analytics.router)
app.include_router(admin.router)



# Conditionally mount frontend build
APP_ENV = os.getenv("APP_ENV", "development")

if APP_ENV in ["test", "production"]:
    frontend_dist = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
    if frontend_dist.exists():
        app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")

@app.get("/")
async def root():
    # Only return JSON message if in dev (otherwise frontend will handle "/")
    if APP_ENV == "development":
        return {"message": "Welcome to AlgorithmicEngine API"}
