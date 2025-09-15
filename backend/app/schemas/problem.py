from pydantic import BaseModel, Field, conint
from typing import List, Optional

# Stars must be integer 1..5
StarType = conint(ge=1, le=5)

class ProblemBase(BaseModel):
    title: str
    statement: str
    stars: int = Field(..., ge=1, le=5, description="Rating 1..5")

class ProblemCreate(ProblemBase):
    tags: Optional[List[str]] = None
    difficulty_notes: Optional[str] = None

class ProblemUpdate(BaseModel):
    title: Optional[str] = None
    statement: Optional[str] = None
    stars: Optional[int] = Field(None, ge=1, le=5, description="Rating 1..5")
    tags: Optional[List[str]] = None
    difficulty_notes: Optional[str] = None

class ProblemResponse(ProblemBase):
    id: int
    tags: Optional[List[str]] = None
    difficulty_notes: Optional[str] = None

    class Config:
        orm_mode = True
