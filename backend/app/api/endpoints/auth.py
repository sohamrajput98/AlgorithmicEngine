from fastapi import APIRouter, HTTPException, Depends
from app.dependencies import get_current_user
from app.models.user import User
from app.database import SessionLocal, get_db
import jwt
from datetime import datetime, timedelta
from sqlalchemy.exc import NoResultFound
from app.schemas.user import UserCreate, UserLogin, Token, UserOut
from app.config import settings
from app import models, schemas
import bcrypt
from app.schemas.user import LoginResponse
from sqlalchemy.orm import Session

router = APIRouter(tags=["auth"])


class AuthService:

    def hash_password(self, password: str) -> str:
        if isinstance(password, str):
          password = password.encode()
        return bcrypt.hashpw(password, bcrypt.gensalt()).decode()

    def verify_password(self, password: str, hashed: str) -> bool:
        if isinstance(password, str):
          password = password.encode()
        if isinstance(hashed, str):
          hashed = hashed.encode()
        return bcrypt.checkpw(password, hashed)

    def create_access_token(self, user_id: int) -> str:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
        payload = {"sub": user_id, "exp": expire}
        return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    def register_user(self, user_create: UserCreate, db: Session) -> User:
        existing_user = db.query(User).filter(User.email == user_create.email).first()
        if existing_user:
            raise ValueError("Email already registered")

        hashed_pw = self.hash_password(user_create.password)

        new_user = User(
            email=user_create.email,
            display_name=user_create.display_name,
            hashed_password=hashed_pw,
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user

    def login_user(self, user_login: UserLogin, db: Session) -> Token:
        try:
            user = db.query(User).filter(User.email == user_login.email).one()
        except NoResultFound:
            raise ValueError("Invalid credentials")

        if not self.verify_password(user_login.password, user.hashed_password):
            raise ValueError("Invalid credentials")

        access_token = self.create_access_token(user.id)

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user,
        }

    def verify_token(self, token: str) -> int | None:
        try:
            payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
            )
            return payload["sub"]
        except jwt.PyJWTError:
            return None


auth_service = AuthService()


@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        db_user = auth_service.register_user(user, db)
        return UserOut.from_orm(db_user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=LoginResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    try:
        return auth_service.login_user(user, db)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.get("/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return schemas.UserOut.from_orm(current_user)