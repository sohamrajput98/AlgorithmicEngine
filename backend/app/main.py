from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pathlib import Path
from fastapi.staticfiles import StaticFiles
from .config import settings
import os

# Import routers
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

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],  # Vercel frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Preflight OPTIONS handler for /auth routes (solves 404 on Render)
preflight_router = APIRouter(prefix="/auth")

@preflight_router.options("/{rest_of_path:path}")
async def preflight_handler(rest_of_path: str):
    return JSONResponse(status_code=200, content={})

app.include_router(preflight_router)

# Include actual routers
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
    if APP_ENV == "development":
        return {"message": "Welcome to AlgorithmicEngine API"}