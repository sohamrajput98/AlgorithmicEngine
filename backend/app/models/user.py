from sqlalchemy import Column, Integer, String, DateTime , Boolean
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(100), nullable=False)
    display_name = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    role = Column(String(100), default="student")
    profile_fields = Column(String(100), default="{}")
    is_active = Column(Boolean, default=True)
