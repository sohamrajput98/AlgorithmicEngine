# File: backend/app/api/endpoints/problems.py
from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional

from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.problem import ProblemCreate, ProblemResponse, ProblemUpdate
from app.services.problem_service import ProblemService

router = APIRouter(prefix="/problems", tags=["problems"])
service = ProblemService()

def _model_to_response(p, status: str = "Todo") -> dict:
    return {
        "id": p.id,
        "title": p.title,
        "statement": p.statement,
        "stars": p.stars,
        "tags": service._parse_tags(p.tags),
        "status": status,
        "difficulty_notes": p.difficulty_notes,
        "expected": p.expected
    }

# --- Create ---
@router.post("/", response_model=ProblemResponse)
def create_problem(payload: ProblemCreate):
    dbp = service.create_problem(payload)
    return _model_to_response(dbp)

# --- 🧠 UPDATED List endpoint with correct filter parameters ---
@router.get("/", response_model=List[ProblemResponse])
def list_problems(
    status: Optional[str] = Query(None, regex="^(Solved|Attempted|Todo)$"),
    stars: Optional[int] = Query(None, ge=1, le=5),
    tags: Optional[str] = Query(None), # Accepts a comma-separated string from frontend
    search: Optional[str] = None,
    sort_by: Optional[str] = Query("stars", regex="^(stars|title)$"),
    order: str = "asc",
    page: int = 1,
    limit: int = 50,
    current_user: User = Depends(get_current_user)
):
    # 🧠 Correctly converts comma-separated tags string into a list for the service
    tags_list = [tag.strip() for tag in tags.split(',')] if tags else None

    problems_with_status, total = service.list_problems_with_status(
        user_id=current_user.id,
        status=status,
        stars=stars,
        tags=tags_list,
        search=search,
        sort_by=sort_by,
        order=order,
        page=page,
        limit=limit
    )
    return [_model_to_response(p, status) for p, status in problems_with_status]

# --- NEW endpoint to get all unique tags ---
@router.get("/tags", response_model=List[str])
def get_all_tags():
    all_tags = service.get_all_unique_tags()
    return all_tags

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