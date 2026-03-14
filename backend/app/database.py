import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.database import Base, engine

# Routers
from app.api.endpoints import (
    health, auth, users, accounts, problems, testcases, submissions,
    badges, analytics, admin
)

APP_ENV = os.getenv("APP_ENV", "development")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5175")

app = FastAPI(
    title="AlgorithmicEngine Backend",
    description="API for AlgorithmicEngine project",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Mount routers under /api
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

# Mount frontend (for production)
if APP_ENV in ["production", "test"]:
    frontend_dist = os.path.join(os.path.dirname(__file__), "../../frontend/dist")
    if os.path.exists(frontend_dist):
        app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")

@app.get("/")
async def root():
    if APP_ENV == "development":
        return {"message": "Welcome to AlgorithmicEngine API"}

# Create tables on startup
@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)