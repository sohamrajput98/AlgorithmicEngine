# backend/app/api/endpoints/problems.py
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional

from app.schemas.problem import ProblemCreate, ProblemResponse, ProblemUpdate
from app.services.problem_service import ProblemService

router = APIRouter(prefix="/problems", tags=["problems"])
service = ProblemService()


def _model_to_response(p) -> dict:
    return {
        "id": p.id,
        "title": p.title,
        "statement": p.statement,
        "stars": p.stars,
        "tags": service._parse_tags(p.tags),
        "difficulty_notes": p.difficulty_notes,
        "expected": p.expected
    }

# --- Create ---
@router.post("/", response_model=ProblemResponse)
def create_problem(payload: ProblemCreate):
    dbp = service.create_problem(payload)
    return _model_to_response(dbp)

# --- List with pagination, filters, search, sort ---
@router.get("/", response_model=List[ProblemResponse])
def list_problems(
    stars: Optional[int] = Query(None, ge=1, le=5),
    tag: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = Query(None, regex="^(stars|title|difficulty_notes)$"),
    order: str = "asc",
    page: int = 1,
    limit: int = 10
):
    items, total = service.list_problems(stars, tag, search, sort_by, order, page, limit)
    return [_model_to_response(p) for p in items]

# --- Get single problem ---
@router.get("/{problem_id}", response_model=ProblemResponse)
def get_problem(problem_id: int):
    p = service.get_problem(problem_id)
    if not p:
        raise HTTPException(status_code=404, detail="Problem not found")
    return _model_to_response(p)

# --- Update ---
@router.put("/{problem_id}", response_model=ProblemResponse)
def update_problem(problem_id: int, payload: ProblemUpdate):
    p = service.update_problem(problem_id, payload)
    if not p:
        raise HTTPException(status_code=404, detail="Problem not found")
    return _model_to_response(p)

# --- Delete ---
@router.delete("/{problem_id}")
def delete_problem(problem_id: int):
    ok = service.delete_problem(problem_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Problem not found")
    return {"ok": True}

# --- Similar problems ---
@router.get("/{problem_id}/similar", response_model=List[ProblemResponse])
def similar_problems(problem_id: int, limit: int = 5):
    problems = service.get_similar_problems(problem_id, limit)
    return [_model_to_response(p) for p in problems]
