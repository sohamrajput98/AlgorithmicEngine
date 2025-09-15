from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from app.services.auth_service import AuthService
from app.models.user import User
from sqlalchemy.orm import Session
from app.database import SessionLocal

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
auth_service = AuthService()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)  # ✅ Inject fresh DB session
):
    user_id = auth_service.verify_token(token)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.id == user_id).first()  # ✅ Use injected DB
    if not user or user.is_active == 0:
        raise HTTPException(status_code=401, detail="Inactive user")
    return user

def get_current_active_user(current_user=Depends(get_current_user)):
    if current_user.is_active == 0:
        raise HTTPException(status_code=403, detail="Inactive user")
    return current_user

def require_admin(current_user=Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user
