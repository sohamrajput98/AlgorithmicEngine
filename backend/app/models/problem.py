# backend/app/models/problem.py
from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    statement = Column(Text, nullable=False)
    expected = Column(Text, nullable=True)  # added expected output
    stars = Column(Integer, default=1)      # 1-5 rating
    tags = Column(String(255))              # JSON string for tags
    difficulty_notes = Column(Text)
