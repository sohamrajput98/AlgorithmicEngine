from pydantic import BaseModel
from typing import Optional


class RatingBase(BaseModel):
    user_id: int
    rating: int


class RatingCreate(RatingBase):
    pass


class RatingResponse(RatingBase):
    id: int
    contest_id: Optional[int] = None

    class Config:
        orm_mode = True
