import json
from typing import List, Optional

from app.models.problem import Problem
from app.schemas.problem import ProblemCreate, ProblemUpdate
from app.database import SessionLocal

class ProblemService:
    def __init__(self):
        # keep existing pattern (SessionLocal per service instance)
        self.db = SessionLocal()

    # helpers for tags serialization
    def _parse_tags(self, tags_field: Optional[str]) -> Optional[List[str]]:
        if not tags_field:
            return None
        try:
            parsed = json.loads(tags_field)
            # ensure list
            if isinstance(parsed, list):
                return parsed
            return [str(parsed)]
        except Exception:
            # fallback: comma separated string
            return [t.strip() for t in str(tags_field).split(",") if t.strip()]

    def _dump_tags(self, tags: Optional[List[str]]) -> Optional[str]:
        if tags is None:
            return None
        return json.dumps(tags)

    # Create
    def create_problem(self, problem: ProblemCreate) -> Problem:
        tags_json = self._dump_tags(problem.tags)
        db_problem = Problem(
            title=problem.title,
            statement=problem.statement,
            stars=problem.stars,
            tags=tags_json,
            difficulty_notes=problem.difficulty_notes
        )
        self.db.add(db_problem)
        self.db.commit()
        self.db.refresh(db_problem)
        return db_problem

    # List with optional filters
    def list_problems(self, stars: Optional[int] = None, tag: Optional[str] = None) -> List[Problem]:
        q = self.db.query(Problem)
        if stars is not None:
            q = q.filter(Problem.stars == stars)
        if tag:
            # tag search inside stored JSON string (approximate, safe for current string column)
            # match either JSON quoted entry or raw substring
            like_pattern = f'%"{tag}"%'
            q = q.filter(Problem.tags.like(like_pattern) | Problem.tags.like(f'%{tag}%'))
        return q.all()

    # Get by id
    def get_problem(self, problem_id: int) -> Optional[Problem]:
        return self.db.query(Problem).filter(Problem.id == problem_id).first()

    # Update
    def update_problem(self, problem_id: int, problem_in: ProblemUpdate) -> Optional[Problem]:
        p = self.get_problem(problem_id)
        if not p:
            return None
        update_data = problem_in.dict(exclude_unset=True)
        # handle tags serialization explicitly
        if "tags" in update_data:
            p.tags = self._dump_tags(update_data.pop("tags"))
        if "difficulty_notes" in update_data:
            p.difficulty_notes = update_data.pop("difficulty_notes")
        for k, v in update_data.items():
            setattr(p, k, v)
        self.db.commit()
        self.db.refresh(p)
        return p

    # Delete
    def delete_problem(self, problem_id: int) -> bool:
        p = self.get_problem(problem_id)
        if not p:
            return False
        self.db.delete(p)
        self.db.commit()
        return True
