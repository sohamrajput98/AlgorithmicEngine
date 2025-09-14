# backend/app/api/endpoints/users.py
from fastapi import APIRouter

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me")
async def get_me():
    # dummy user for demo
    return {
        "id": 1,
        "display_name": "Soham",
        "email": "soham@example.com",
        "solved": 1
    }
