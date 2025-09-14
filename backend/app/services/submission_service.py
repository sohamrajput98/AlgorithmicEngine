from backend.app.models.submission import Submission
from backend.app.schemas.submission import SubmissionCreate
from backend.app.database import SessionLocal

class SubmissionService:
    def __init__(self):
        self.db = SessionLocal()

    def create_submission(self, sub: SubmissionCreate) -> Submission:
        db_sub = Submission(
            user_id=sub.user_id,
            problem_id=sub.problem_id,
            code=sub.code,
            language=sub.language,
            status="queued"
        )
        self.db.add(db_sub)
        self.db.commit()
        self.db.refresh(db_sub)
        return db_sub

    def list_submissions(self, user_id: int) -> list[Submission]:
        return self.db.query(Submission).filter(Submission.user_id == user_id).all()