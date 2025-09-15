from fastapi import APIRouter, Depends
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "display_name": current_user.display_name,
        "email": current_user.email,
        "role": current_user.role,
        "is_active": current_user.is_active
    }