from fastapi import APIRouter
from backend.app.schemas.user import UserResponse

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserResponse)
def get_me():
    # Stub: replace with real auth
    return {"id": 1, "email": "demo@example.com", "display_name": "Demo User"}
