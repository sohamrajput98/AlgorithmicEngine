# backend/app/schemas/testcase.py
from pydantic import BaseModel, Field
from typing import Optional

class TestCaseBase(BaseModel):
    input_data: str
    expected_output: str
    is_sample: bool = Field(False, description="Sample (visible) vs hidden")
    time_complexity: Optional[str] = None
    space_complexity: Optional[str] = None
class TestCaseCreate(TestCaseBase):
    problem_id: int
    time_limit_ms: Optional[int] = Field(None, ge=1)
    memory_limit_kb: Optional[int] = Field(None, ge=1024)

class TestCaseUpdate(BaseModel):
    input_data: Optional[str] = None
    expected_output: Optional[str] = None
    is_sample: Optional[bool] = None
    time_limit_ms: Optional[int] = Field(None, ge=1)
    memory_limit_kb: Optional[int] = Field(None, ge=1024)

class TestCaseResponse(TestCaseBase):
    id: int
    problem_id: int
    time_limit_ms: Optional[int] = None
    memory_limit_kb: Optional[int] = None

    class Config:
        orm_mode = True
