# backend/app/models/feature_flag.py
from sqlalchemy import Column, String, Boolean, Text
from backend.app.database import Base

class FeatureFlag(Base):
    __tablename__ = "feature_flags"

    key = Column(String(100), primary_key=True)
    enabled = Column(Boolean, default=False)
    meta = Column(Text)  # JSON string if needed
