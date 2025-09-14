# backend/app/api/endpoints/problems.py
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/problems", tags=["problems"])

# Simple demo problems with one sample testcase each
DUMMY_PROBLEMS = [
    {"id": 1, "title": "Print 42", "statement": "Print 42 to stdout", "stars": 1,
     "sample_input": "", "sample_output": "42"},
    {"id": 2, "title": "Sum Two", "statement": "Read two ints and print sum", "stars": 2,
     "sample_input": "1 2", "sample_output": "3"},
    {"id": 3, "title": "Echo", "statement": "Echo the input", "stars": 1,
     "sample_input": "hello", "sample_output": "hello"},
]

@router.get("/")
async def list_problems():
    return DUMMY_PROBLEMS

@router.get("/{problem_id}")
async def get_problem(problem_id: int):
    p = next((x for x in DUMMY_PROBLEMS if x["id"] == problem_id), None)
    if not p:
        raise HTTPException(status_code=404, detail="Problem not found")
    return p
