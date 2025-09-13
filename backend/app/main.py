from fastapi import FastAPI
from app.api.health import router as health_router

from app.config import settings

app = FastAPI(title="AlgorithmicEngine Backend")

# Include routers
app.include_router(health_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to AlgorithmicEngine API"}
