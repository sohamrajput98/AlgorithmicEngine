from pydantic import BaseModel
from typing import Optional


class AnalyticsBase(BaseModel):
    solved_count: int
    accuracy: float


class AnalyticsResponse(AnalyticsBase):
    id: int
    user_id: int
    current_streak: Optional[int] = 0
    longest_streak: Optional[int] = 0
    avg_solve_time_ms: Optional[int] = None

    class Config:
        orm_mode = True
