from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional

from app.schemas.problem import ProblemCreate, ProblemResponse, ProblemUpdate
from app.services.problem_service import ProblemService

router = APIRouter(prefix="/problems", tags=["problems"])
service = ProblemService()

DUMMY_PROBLEMS = [
    {
        "id": 1,
        "title": "Print Hello",
        "statement": "Write a program that prints 'Hello'",
        "expected": "Hello\n",
        "tags": ["intro", "easy"],
        "stars": 1,
        "difficulty_notes": "Basic print statement"
    },
    {
        "id": 2,
        "title": "Add Two Numbers",
        "statement": "Write a program that adds two numbers",
        "expected": "7\n",
        "tags": ["math", "easy"],
        "stars": 2,
        "difficulty_notes": "Simple arithmetic"
    },
    {
    "id": 3,
    "title": "Check Even Number",
    "statement": "Write a one-line Python program that prints True if 6 is even",
    "expected": "True\n",
    "tags": ["logic", "easy"],
    "stars": 1,
    "difficulty_notes": "Basic modulo operation"
}
]
def _model_to_response(p) -> dict:
    return {
        "id": p.id,
        "title": p.title,
        "statement": p.statement,
        "stars": p.stars,
        "tags": service._parse_tags(p.tags),
        "difficulty_notes": p.difficulty_notes,
    }

@router.post("/", response_model=ProblemResponse)
def create_problem(payload: ProblemCreate):
    dbp = service.create_problem(payload)
    return _model_to_response(dbp)

@router.get("/", response_model=List[ProblemResponse])
def list_problems(stars: Optional[int] = Query(None, ge=1, le=5), tag: Optional[str] = Query(None)):
    items = service.list_problems(stars=stars, tag=tag)
    return [_model_to_response(p) for p in items]

@router.get("/{problem_id}", response_model=ProblemResponse)
def get_problem(problem_id: int):
    p = service.get_problem(problem_id)
    if not p:
        raise HTTPException(status_code=404, detail="Problem not found")
    return _model_to_response(p)

@router.put("/{problem_id}", response_model=ProblemResponse)
def update_problem(problem_id: int, payload: ProblemUpdate):
    p = service.update_problem(problem_id, payload)
    if not p:
        raise HTTPException(status_code=404, detail="Problem not found")
    return _model_to_response(p)

@router.delete("/{problem_id}")
def delete_problem(problem_id: int):
    ok = service.delete_problem(problem_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Problem not found")
    return {"ok": True}
