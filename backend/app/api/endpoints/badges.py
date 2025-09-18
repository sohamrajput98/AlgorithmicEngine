from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.badge_service import BadgeService
import json
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
def get_user_badges(user_id: int):
    # Stub: always return first_submission for demo
    return [{
        "key": "first_submission",
        "name": "First Submit",
        "description": "Submitted your first solution",
        "criteria": {},
        "image_url": "/static/badges/first_submission.png"
    }]