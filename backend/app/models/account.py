# backend/app/models/account.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String(50))  # github/linkedin/etc
    url = Column(String(255))
    username = Column(String(100))

    user = relationship("User", backref="accounts")
