from backend.app.models.user import User
from backend.app.database import SessionLocal
from passlib.hash import bcrypt
import jwt
from datetime import datetime, timedelta

SECRET_KEY = "devsecret"

class AuthService:
    def __init__(self):
        self.db = SessionLocal()

    def hash_password(self, password: str) -> str:
        return bcrypt.hash(password)

    def verify_password(self, password: str, hashed: str) -> bool:
        return bcrypt.verify(password, hashed)

    def create_access_token(self, user_id: int) -> str:
        payload = {"sub": user_id, "exp": datetime.utcnow() + timedelta(hours=1)}
        return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    def verify_token(self, token: str) -> int | None:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            return payload["sub"]
        except jwt.PyJWTError:
            return None