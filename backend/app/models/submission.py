from sqlalchemy import Column, Integer, Text, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # ✅ made nullable
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)
    code = Column(Text, nullable=False)
    language = Column(String(50))
    status = Column(String(50), default="queued")
    runtime_ms = Column(Integer)
    memory_kb = Column(Integer)
    result_log = Column(Text)
    passes = Column(Integer, default=0)        # ✅ added
    total = Column(Integer, default=0)         # ✅ added
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", backref="submissions")
    problem = relationship("Problem", backref="submissions")