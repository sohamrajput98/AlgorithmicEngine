from fastapi import APIRouter, Depends
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])
auth_service = AuthService()

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate):
    return auth_service.register_user(user)

@router.post("/login")
def login(email: str, password: str):
    return auth_service.login_user(email, password)
