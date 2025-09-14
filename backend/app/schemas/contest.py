from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ContestBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime


class ContestCreate(ContestBase):
    pass


class ContestResponse(ContestBase):
    id: int

    class Config:
        orm_mode = True
