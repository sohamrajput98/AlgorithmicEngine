from backend.app.models.problem import Problem
from backend.app.schemas.problem import ProblemCreate
from backend.app.database import SessionLocal

class ProblemService:
    def __init__(self):
        self.db = SessionLocal()

    def create_problem(self, problem: ProblemCreate) -> Problem:
        db_problem = Problem(
            title=problem.title,
            statement=problem.statement,
            stars=problem.stars
        )
        self.db.add(db_problem)
        self.db.commit()
        self.db.refresh(db_problem)
        return db_problem

    def list_problems(self) -> list[Problem]:
        return self.db.query(Problem).all()