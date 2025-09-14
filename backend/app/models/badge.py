# backend/app/models/badge.py
from sqlalchemy import Column, Integer, String, Text
from backend.app.database import Base

class Badge(Base):
    __tablename__ = "badges"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    criteria_json = Column(Text)  # store rules in JSON
    icon_path = Column(String(255))
