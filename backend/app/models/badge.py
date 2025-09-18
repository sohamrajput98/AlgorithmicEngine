from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class Badge(Base):
    __tablename__ = "badges"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    criteria_json = Column(Text)  # store rules in JSON string
    icon_path = Column(String(255))  # e.g. /static/badges/first_submission.png
