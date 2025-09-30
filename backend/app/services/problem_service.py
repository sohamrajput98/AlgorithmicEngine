import json
from typing import List, Optional, Tuple

from sqlalchemy import or_, and_, asc, desc
from app.database import SessionLocal
from app.models.problem import Problem
from app.models.submission import Submission
from app.schemas.problem import ProblemCreate, ProblemUpdate


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

    # --- 🧠 UPDATED METHOD to get problems with status and advanced filters ---
    def list_problems_with_status(
        self,
        user_id: int,
        status: Optional[str] = None,
        stars: Optional[int] = None,
        tags: Optional[List[str]] = None,
        search: Optional[str] = None,
        sort_by: Optional[str] = None,
        order: str = "asc",
        page: int = 1,
        limit: int = 10
    ) -> Tuple[List[Tuple[Problem, str]], int]:
        # First, get all submissions for the current user to determine status
        user_submissions = self.db.query(Submission).filter(Submission.user_id == user_id).all()
        
        solved_problem_ids = {s.problem_id for s in user_submissions if s.status == 'accepted'}
        attempted_problem_ids = {s.problem_id for s in user_submissions}

        # Build the main query for problems with database-level filters
        q = self.db.query(Problem)

        if stars is not None:
            q = q.filter(Problem.stars == stars)
        if tags:
            # Logic to filter by multiple tags: problem must contain ALL specified tags
            tag_filters = []
            for tag in tags:
                like_pattern = f'%"{tag}"%'
                tag_filters.append(Problem.tags.like(like_pattern))
            q = q.filter(and_(*tag_filters))
        if search:
            search_pattern = f"%{search}%"
            q = q.filter(or_(Problem.title.like(search_pattern), Problem.statement.like(search_pattern)))

        # Sorting
        if sort_by in ["stars", "title"]:
            sort_column = getattr(Problem, sort_by)
            q = q.order_by(asc(sort_column) if order == "asc" else desc(sort_column))

        all_filtered_problems = q.all()

        # Combine problems with their status before filtering by status and paginating
        results_with_status = []
        for problem in all_filtered_problems:
            p_status = "Todo"
            if problem.id in solved_problem_ids:
                p_status = "Solved"
            elif problem.id in attempted_problem_ids:
                p_status = "Attempted"
            
            # Perform status filter here in Python after calculating the status
            if not status or p_status == status:
                 results_with_status.append((problem, p_status))
            
        total = len(results_with_status)
        
        # Apply pagination after all filtering is done
        start = (page - 1) * limit
        end = start + limit
        paginated_results = results_with_status[start:end]
            
        return paginated_results, total

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
    
    # --- New method to get all unique tags for the filter dropdown ---
    def get_all_unique_tags(self) -> List[str]:
        all_problems = self.db.query(Problem.tags).filter(Problem.tags != None).all()
        tags_set = set()
        for tags_json, in all_problems:
            parsed_tags = self._parse_tags(tags_json)
            if parsed_tags:
                for tag in parsed_tags:
                    tags_set.add(tag)
        return sorted(list(tags_set))
