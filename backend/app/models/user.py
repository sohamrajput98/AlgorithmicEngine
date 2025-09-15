from sqlalchemy import Column, Integer, String, DateTime , Boolean
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    display_name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    role = Column(String, default="student")
    profile_fields = Column(String, default="{}")
    is_active = Column(Boolean, default=1)  # 1 = active, 0 = inactive
