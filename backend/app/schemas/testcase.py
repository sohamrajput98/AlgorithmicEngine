from pydantic import BaseModel
from typing import Optional


class TestCaseBase(BaseModel):
    input_data: str
    expected_output: str
    is_sample: bool = False


class TestCaseCreate(TestCaseBase):
    problem_id: int
    time_limit_ms: Optional[int] = None
    memory_limit_kb: Optional[int] = None


class TestCaseResponse(TestCaseBase):
    id: int
    problem_id: int

    class Config:
        orm_mode = True
