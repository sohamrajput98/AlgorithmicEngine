# backend/app/schemas/problem.py
from typing import List, Optional
from pydantic import BaseModel

class ProblemBase(BaseModel):
    title: str
    statement: str
    stars: int = 1
    tags: Optional[List[str]] = None
    difficulty_notes: Optional[str] = None
    expected: Optional[str] = None

class ProblemCreate(ProblemBase):
    pass

class ProblemUpdate(BaseModel):
    title: Optional[str] = None
    statement: Optional[str] = None
    stars: Optional[int] = None
    tags: Optional[List[str]] = None
    difficulty_notes: Optional[str] = None
    expected: Optional[str] = None

class ProblemResponse(ProblemBase):
    id: int

    class Config:
        orm_mode = True
