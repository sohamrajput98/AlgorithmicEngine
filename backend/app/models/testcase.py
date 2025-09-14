# backend/app/models/testcase.py
from sqlalchemy import Column, Integer, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database import Base

class TestCase(Base):
    __tablename__ = "testcases"

    id = Column(Integer, primary_key=True, index=True)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)
    input_data = Column(Text, nullable=False)
    expected_output = Column(Text, nullable=False)
    is_sample = Column(Boolean, default=False)
    time_limit_ms = Column(Integer, default=1000)
    memory_limit_kb = Column(Integer, default=65536)

    problem = relationship("Problem", backref="testcases")
