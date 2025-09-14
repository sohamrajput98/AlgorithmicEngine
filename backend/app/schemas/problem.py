from pydantic import BaseModel
from typing import List, Optional


class ProblemBase(BaseModel):
    title: str
    statement: str
    stars: int


class ProblemCreate(ProblemBase):
    tags: Optional[List[str]] = None
    difficulty_notes: Optional[str] = None


class ProblemUpdate(BaseModel):
    title: Optional[str] = None
    statement: Optional[str] = None
    stars: Optional[int] = None
    tags: Optional[List[str]] = None


class ProblemResponse(ProblemBase):
    id: int
    tags: Optional[List[str]] = None
    difficulty_notes: Optional[str] = None

    class Config:
        orm_mode = True
