# backend/app/models/problem.py
from sqlalchemy import Column, Integer, String, Text
from backend.app.database import Base

class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    statement = Column(Text, nullable=False)
    stars = Column(Integer, default=1)  # 1-5 rating
    tags = Column(String(255)) # could be JSON string or M2M later
    difficulty_notes = Column(Text)
