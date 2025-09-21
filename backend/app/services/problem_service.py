# backend/app/services/problem_service.py
import json
from typing import List, Optional, Tuple

from sqlalchemy import or_, asc, desc
from app.models.problem import Problem
from app.schemas.problem import ProblemCreate, ProblemUpdate
from app.database import SessionLocal


class ProblemService:
    def __init__(self):
        self.db = SessionLocal()

    # --- Tags helpers ---
    def _parse_tags(self, tags_field: Optional[str]) -> Optional[List[str]]:
        if not tags_field:
            return None
        try:
            parsed = json.loads(tags_field)
            if isinstance(parsed, list):
                return parsed
            return [str(parsed)]
        except Exception:
            return [t.strip() for t in str(tags_field).split(",") if t.strip()]

    def _dump_tags(self, tags: Optional[List[str]]) -> Optional[str]:
        if tags is None:
            return None
        return json.dumps(tags)

    # --- Create ---
    def create_problem(self, problem: ProblemCreate) -> Problem:
        tags_json = self._dump_tags(problem.tags)
        db_problem = Problem(
            title=problem.title,
            statement=problem.statement,
            stars=problem.stars,
            tags=tags_json,
            difficulty_notes=problem.difficulty_notes,
            expected=problem.expected
        )
        self.db.add(db_problem)
        self.db.commit()
        self.db.refresh(db_problem)
        return db_problem

    # --- List with filters, search, sorting, pagination ---
    def list_problems(
        self,
        stars: Optional[int] = None,
        tag: Optional[str] = None,
        search: Optional[str] = None,
        sort_by: Optional[str] = None,
        order: str = "asc",
        page: int = 1,
        limit: int = 10
    ) -> Tuple[List[Problem], int]:
        q = self.db.query(Problem)

        if stars is not None:
            q = q.filter(Problem.stars == stars)
        if tag:
            like_pattern = f'%"{tag}"%'
            q = q.filter(Problem.tags.like(like_pattern) | Problem.tags.like(f'%{tag}%'))
        if search:
            search_pattern = f"%{search}%"
            q = q.filter(or_(Problem.title.like(search_pattern), Problem.statement.like(search_pattern)))

        # Sorting
        if sort_by in ["stars", "title", "difficulty_notes"]:
            q = q.order_by(asc(getattr(Problem, sort_by)) if order == "asc" else desc(getattr(Problem, sort_by)))

        total = q.count()
        q = q.offset((page - 1) * limit).limit(limit)
        return q.all(), total

    # --- Get by id ---
    def get_problem(self, problem_id: int) -> Optional[Problem]:
        return self.db.query(Problem).filter(Problem.id == problem_id).first()

    # --- Update ---
    def update_problem(self, problem_id: int, problem_in: ProblemUpdate) -> Optional[Problem]:
        p = self.get_problem(problem_id)
        if not p:
            return None
        update_data = problem_in.dict(exclude_unset=True)
        if "tags" in update_data:
            p.tags = self._dump_tags(update_data.pop("tags"))
        if "difficulty_notes" in update_data:
            p.difficulty_notes = update_data.pop("difficulty_notes")
        if "expected" in update_data:
            p.expected = update_data.pop("expected")
        for k, v in update_data.items():
            setattr(p, k, v)
        self.db.commit()
        self.db.refresh(p)
        return p

    # --- Delete ---
    def delete_problem(self, problem_id: int) -> bool:
        p = self.get_problem(problem_id)
        if not p:
            return False
        self.db.delete(p)
        self.db.commit()
        return True

    # --- Similar problems ---
    def get_similar_problems(self, problem_id: int, limit: int = 5) -> List[Problem]:
        current = self.get_problem(problem_id)
        if not current or not current.tags:
            return []

        tags = self._parse_tags(current.tags)
        if not tags:
            return []

        q = self.db.query(Problem).filter(Problem.id != problem_id)
        tag_filters = [Problem.tags.like(f'%"{t}"%') | Problem.tags.like(f'%{t}%') for t in tags]
        q = q.filter(or_(*tag_filters)).limit(limit)
        return q.all()
