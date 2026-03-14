from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from fastapi.staticfiles import StaticFiles
from .config import settings
from app.models import Base
from app.database import engine
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
    allow_origins=[settings.FRONTEND_URL],  # your Vercel frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MOUNT ALL API ROUTERS UNDER /api ---
app.include_router(health.router, prefix="/api/health")
app.include_router(auth.router, prefix="/api/auth")
app.include_router(users.router, prefix="/api/users")
app.include_router(accounts.router, prefix="/api/accounts")
app.include_router(problems.router, prefix="/api/problems")
app.include_router(testcases.router, prefix="/api/testcases")
app.include_router(submissions.router, prefix="/api/submissions")
app.include_router(badges.router, prefix="/api/badges")
app.include_router(analytics.router, prefix="/api/analytics")
app.include_router(admin.router, prefix="/api/admin")

# --- STATIC FRONTEND MOUNT ---
APP_ENV = os.getenv("APP_ENV", "development")
if APP_ENV in ["test", "production"]:
    frontend_dist = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
    if frontend_dist.exists():
        # All non-API routes go to frontend
        app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")

# --- ROOT IN DEV ONLY ---
@app.get("/")
async def root():
    if APP_ENV == "development":
        return {"message": "Welcome to AlgorithmicEngine API"}
    
for route in app.routes:
    print(route.path, route.methods)

@app.on_event("startup")
async def create_tables():
    Base.metadata.create_all(bind=engine)
    print("✅ All tables created (if missing).")