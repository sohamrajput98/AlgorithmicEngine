from pydantic import BaseModel
from typing import Optional


class BadgeBase(BaseModel):
    key: str
    name: str
    description: Optional[str] = None


class BadgeCreate(BadgeBase):
    criteria_json: Optional[dict] = None
    icon_path: Optional[str] = None


class BadgeResponse(BadgeBase):
    id: int

    class Config:
        orm_mode = True
