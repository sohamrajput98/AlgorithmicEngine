from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.badge_service import BadgeService
from app.services.badge_service import HARDCODED_BADGES
import json
from app.models.user_badge import UserBadge
from app.models.badge import Badge

router = APIRouter(prefix="/badges", tags=["badges"])

@router.get("/")
def list_badges(db: Session = Depends(get_db)):
    service = BadgeService(db)
    return service.list_badges()

@router.get("/{key}")
def get_badge(key: str, db: Session = Depends(get_db)):
    service = BadgeService(db)
    badge = service.get_badge_by_key(key)
    if not badge:
        raise HTTPException(status_code=404, detail="Badge not found")
    return {
        "id": badge.id,
        "key": badge.key,
        "name": badge.name,
        "description": badge.description,
        "criteria": json.loads(badge.criteria_json or "{}"),
        "image_url": badge.icon_path,
    }

@router.post("/assign")
def assign_badge(user_id: int, badge_key: str, db: Session = Depends(get_db)):
    service = BadgeService(db)
    badge = service.get_badge_by_key(badge_key)
    if not badge:
        raise HTTPException(status_code=404, detail="Badge not found")

    # You’ll need to implement this method in BadgeService
    service.assign_badge_to_user(user_id, badge_key)
    return {"message": f"Badge '{badge_key}' assigned to user {user_id}"}

@router.get("/user/{user_id}")
def get_user_badges(user_id: int, db: Session = Depends(get_db)):
    earned_keys = db.query(UserBadge.badge_key).filter(UserBadge.user_id == user_id).all()
    earned_keys = [key for (key,) in earned_keys]

    badges = db.query(Badge).filter(Badge.key.in_(earned_keys)).all()

    return [
        {
            "id": b.id,
            "key": b.key,
            "name": b.name,
            "description": b.description,
            "criteria": json.loads(b.criteria_json or "{}"),
            "image_url": b.icon_path,
        }
        for b in badges
    ]