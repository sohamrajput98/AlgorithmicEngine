from fastapi import FastAPI
from app.config import settings

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

app = FastAPI(title="AlgorithmicEngine Backend")

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

@app.get("/")
async def root():
    return {"message": "Welcome to AlgorithmicEngine API"}
