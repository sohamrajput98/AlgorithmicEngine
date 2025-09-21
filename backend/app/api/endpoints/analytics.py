# backend/app/api/endpoints/analytics.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.submission import Submission
from app.services.badge_service import BadgeService

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/summary")
def get_user_analytics(user_id: int, db: Session = Depends(get_db)):
    submissions = db.query(Submission).filter(Submission.user_id == user_id).all()
    total_submissions = len(submissions)
    accepted_submissions = sum(1 for s in submissions if s.status == "accepted")
    failed_submissions = sum(1 for s in submissions if s.status == "failed")

    # badges
    badge_service = BadgeService(db)
    badges = badge_service.list_badges()

    return {
        "total_submissions": total_submissions,
        "accepted_submissions": accepted_submissions,
        "failed_submissions": failed_submissions,
        "badges": badges,
    }
