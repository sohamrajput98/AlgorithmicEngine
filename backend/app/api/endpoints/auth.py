from fastapi import APIRouter, HTTPException, Depends
from app.dependencies import get_current_user
from app.models.user import User
from app.database import SessionLocal
from passlib.hash import bcrypt
import jwt
from datetime import datetime, timedelta
from sqlalchemy.exc import NoResultFound
from app.schemas.user import UserCreate, UserLogin, Token, UserOut
from app.config import settings
from app import models, schemas
import bcrypt
from app.schemas.user import LoginResponse 

router = APIRouter(prefix="/auth", tags=["auth"])

class AuthService:
    def __init__(self):
        self.db = SessionLocal()



    def hash_password(self, password: str) -> str:
      return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

    def verify_password(self, password: str, hashed: str) -> bool:
      return bcrypt.checkpw(password.encode(), hashed.encode())

    def create_access_token(self, user_id: int) -> str:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        payload = {"sub": user_id, "exp": expire}
        return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    def register_user(self, user_create: UserCreate) -> User:
        existing_user = self.db.query(User).filter(User.email == user_create.email).first()
        if existing_user:
            raise ValueError("Email already registered")
        hashed_pw = self.hash_password(user_create.password)
        new_user = User(
            email=user_create.email,
            display_name=user_create.display_name,
            hashed_password=hashed_pw,
        )
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        return new_user

    def login_user(self, user_login: UserLogin) -> Token:
        try:
            user = self.db.query(User).filter(User.email == user_login.email).one()
        except NoResultFound:
            raise ValueError("Invalid credentials")
        if not self.verify_password(user_login.password, user.hashed_password):
            raise ValueError("Invalid credentials")
        access_token = self.create_access_token(user.id)
        return {
    "access_token": access_token,
    "token_type": "bearer",
    "user": user
}

    def verify_token(self, token: str) -> int | None:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            return payload["sub"]
        except jwt.PyJWTError:
            return None

auth_service = AuthService()

@router.post("/register", response_model=UserOut)
def register(user: UserCreate):
    try:
        db_user = auth_service.register_user(user)
        return UserOut.from_orm(db_user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=LoginResponse)
def login(user: UserLogin):
    try:
        return auth_service.login_user(user)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
   
@router.get("/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return schemas.UserOut.from_orm(current_user)