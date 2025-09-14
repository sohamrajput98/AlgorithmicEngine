# backend/app/models/contest.py
from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base

class Contest(Base):
    __tablename__ = "contests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    start_time = Column(DateTime, server_default=func.now())
    end_time = Column(DateTime, nullable=True)
