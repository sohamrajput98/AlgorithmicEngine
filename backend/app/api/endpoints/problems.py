from fastapi import APIRouter
from backend.app.schemas.problem import ProblemResponse

router = APIRouter(prefix="/problems", tags=["problems"])

@router.get("/", response_model=list[ProblemResponse])
def list_problems(stars: int | None = None, tag: str | None = None):
    return []

@router.get("/{problem_id}", response_model=ProblemResponse)
def get_problem(problem_id: int):
    return {"id": problem_id, "title": "Two Sum", "statement": "Find indices..."}
