from app.models.user import User
from app.database import SessionLocal
from passlib.hash import bcrypt
import jwt
from datetime import datetime, timedelta
from sqlalchemy.exc import NoResultFound
from app.schemas.user import UserCreate, UserLogin, Token
from app.config import settings

class AuthService:
    def __init__(self):
        self.db = SessionLocal()

    def hash_password(self, password: str) -> str:
        return bcrypt.hash(password)

    def verify_password(self, password: str, hashed: str) -> bool:
        return bcrypt.verify(password, hashed)

    def create_access_token(self, user_id: int) -> str:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        payload = {"sub": user_id, "exp": expire}
        return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    # -------- User Operations --------
    def register_user(self, user_create: UserCreate) -> User:
        print("Incoming payload:", user_create.dict())
        print("Existing user:", existing_user)
        existing_user = self.db.query(User).filter(User.email == user_create.email).first()
        if existing_user:
            raise ValueError("Email already registered")
        hashed_pw = self.hash_password(user_create.password)
        new_user = User(email=user_create.email, display_name=user_create.display_name, hashed_password=hashed_pw)
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        print("Created user:", new_user.__dict__)
        print("Connected DB:", self.db.execute("SELECT DATABASE();").scalar())
        db_name = self.db.execute("SELECT DATABASE();").scalar()
        print("🔥 Connected to DB:", db_name)
        return new_user

    def login_user(self, user_login: UserLogin) -> Token:
        try:
            user = self.db.query(User).filter(User.email == user_login.email).one()
        except NoResultFound:
            raise ValueError("Invalid credentials")
        if not self.verify_password(user_login.password, user.hashed_password):
            raise ValueError("Invalid credentials")
        access_token = self.create_access_token(user.id)
        return Token(access_token=access_token, token_type="bearer")

    def verify_token(self, token: str) -> int | None:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            return payload["sub"]
        except jwt.PyJWTError:
            return None
