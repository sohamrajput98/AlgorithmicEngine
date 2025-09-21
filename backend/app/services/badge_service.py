import json
from sqlalchemy.orm import Session
from app.models.user_badge import UserBadge
from app.models.badge import Badge
__all__ = ["BadgeService", "HARDCODED_BADGES"]

HARDCODED_BADGES = [
    {
        "key": "first_submission",
        "name": "First Submit",
        "description": "Submitted your first solution",
        "criteria": {},
        "image_url": "/badges/first_submission.png"
    },
    {
        "key": "daily_streaker",
        "name": "Daily Streaker",
        "description": "Submitted code daily for 3 days",
        "criteria": {},
        "image_url": "/badges/daily_streaker.png"
    },
    {
        "key": "streak_30",
        "name": "30-Day Streak",
        "description": "Solved problems 30 days in a row",
        "image_url": "/badges/streak_30.png"
    },
    {
        "key": "consistency_king",
        "name": "Consistency King",
        "description": "Submitted code consistently for 7 days",
        "image_url": "/badges/consistency_king.png"
    },
    {
        "key": "algo_explorer",
        "name": "Algo Explorer",
        "description": "Explored 10 different problems",
        "image_url": "/badges/algo_explorer.png"
    },
    {
        "key": "bug_slayer",
        "name": "Bug Slayer",
        "description": "Solved a tricky problem",
        "image_url": "/badges/bug_slayer.png"
    },
    {
        "key": "logic_master",
        "name": "Logic Master",
        "description": "Solved 10 problems",
        "image_url": "/badges/logic_master.png"
    },
    {
        "key": "never_give_up",
        "name": "Never Give Up",
        "description": "Kept submitting despite failures",
        "image_url": "/badges/never_give_up.png"
    },
    {
        "key": "speed_coder",
        "name": "Speed Coder",
        "description": "Solved a problem in under 5 minutes",
        "image_url": "/badges/speed_coder.png"
    },
    {
        "key": "final_mastery",
        "name": "Final Badge",
        "description": "Completed all problems",
        "image_url": "/badges/final_mastery.png"
    }
    # ... add the rest here
]

class BadgeService:
    def __init__(self, db: Session):
        self.db = db

    def list_badges(self):
     print("[DEBUG] Fetching badges from DB...")
     badges = self.db.query(Badge).all()
     print(f"[DEBUG] Retrieved {len(badges)} badges")

     if not badges:
        print("[DEBUG] No DB badges found, returning hardcoded list")
        return HARDCODED_BADGES

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

    def get_badge_by_key(self, key: str):
        badge = self.db.query(Badge).filter(Badge.key == key).first()
        if badge:
            return badge

        # Fallback to hardcoded badges
        for b in HARDCODED_BADGES:
            if b["key"] == key:
                class DummyBadge:
                    id = None
                    key = b["key"]
                    name = b["name"]
                    description = b["description"]
                    criteria_json = json.dumps(b["criteria"])
                    icon_path = b["image_url"]
                return DummyBadge()

        return None

    def assign_badge_to_user(self, user_id: int, badge_key: str):
    # Check if badge exists in DB
        badge = self.db.query(Badge).filter(Badge.key == badge_key).first()
        if not badge:
         raise Exception(f"Badge '{badge_key}' not found in DB")

    # Check if badge already assigned
        exists = self.db.query(UserBadge).filter_by(user_id=user_id, badge_key=badge_key).first()
        if exists:
         print(f"[•] Badge '{badge_key}' already assigned to user {user_id}")
         return

    # Assign badge
        new_user_badge = UserBadge(user_id=user_id, badge_key=badge_key)
        self.db.add(new_user_badge)
        self.db.commit()
        print(f"[✓] Assigned badge '{badge_key}' to user {user_id}")

