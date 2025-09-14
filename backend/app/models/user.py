# backend/app/models/user.py
from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    display_name = Column(String(100))
    created_at = Column(DateTime, server_default=func.now())
    role = Column(String(50), default="student")  # or Enum('admin','student')
    profile_fields = Column(String)  # JSON string or separate profile table
