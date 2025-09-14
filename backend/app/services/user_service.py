from app.models.user import User
from app.schemas.user import UserCreate
from app.database import SessionLocal

class UserService:
    def __init__(self):
        self.db = SessionLocal()

    def create_user(self, user: UserCreate) -> User:
        db_user = User(
            email=user.email,
            hashed_password=user.hashed_password,
            display_name=user.display_name
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def get_user(self, user_id: int) -> User | None:
        return self.db.query(User).filter(User.id == user_id).first()