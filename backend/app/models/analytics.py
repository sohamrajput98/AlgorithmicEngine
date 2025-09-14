# backend/app/models/analytics.py
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Analytics(Base):
    __tablename__ = "analytics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    solved_count = Column(Integer, default=0)
    accuracy = Column(Integer, default=0)  # percentage
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    avg_solve_time_ms = Column(Integer, default=0)

    user = relationship("User", backref="analytics")
