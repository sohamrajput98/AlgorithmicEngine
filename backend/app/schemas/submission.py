from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SubmissionBase(BaseModel):
    problem_id: int
    code: str
    language: str


class SubmissionCreate(SubmissionBase):
    pass


class SubmissionResponse(SubmissionBase):
    id: int
    user_id: int
    status: str
    runtime_ms: Optional[int] = None
    memory_kb: Optional[int] = None
    result_log: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True
