import json
from sqlalchemy.orm import Session
from app.models.badge import Badge

HARDCODED_BADGES = [
    {
        "key": "first_submission",
        "name": "First Submit",
        "description": "Submitted your first solution",
        "criteria": {},
        "image_url": "/static/badges/first_submission.png"
    },
    {
        "key": "daily_streaker",
        "name": "Daily Streaker",
        "description": "Submitted code daily for 3 days",
        "criteria": {},
        "image_url": "/static/badges/daily_streaker.png"
    },
    { 
        "key": "streak_30", 
     "name": "30-Day Streak", 
     "description": "Solved problems 30 days in a row", 
     "image_url": "/static/badges/streak_30.png" 
    
     },
    { "key": "consistency_king", 
     "name": "Consistency King", 
     "description": "Submitted code consistently for 7 days", 
     "image_url": "/static/badges/consistency_king.png" 
     }, 
    { "key": "algo_explorer", 
     "name": "Algo Explorer", 
     "description": "Explored 10 different problems", 
     "image_url": "/static/badges/algo_explorer.png" 
     }, 
    { "key": "bug_slayer", 
     "name": "Bug Slayer", 
     "description": "Solved a tricky problem", 
     "image_url": "/static/badges/bug_slayer.png" 
     }, 
    { "key": "logic_master", 
     "name": "Logic Master", 
     "description": "Solved 10 problems", 
     "image_url": "/static/badges/logic_master.png" 
     }, 
    { "key": "never_give_up", 
     "name": "Never Give Up", 
     "description": "Kept submitting despite failures", 
     "image_url": "/static/badges/never_give_up.png" 
     }, 
    { "key": "speed_coder", 
     "name": "Speed Coder", 
     "description": "Solved a problem in under 5 minutes", 
     "image_url": "/static/badges/speed_coder.png" 
     }, 
    { "key": "final_mastery", 
     "name": "Final Badge", 
     "description": "Completed all problems", 
     "image_url": "/static/badges/final_mastery.png" 
     }
    # ... add the rest here
]

class BadgeService:
    def __init__(self, db: Session):
        self.db = db

    def list_badges(self):
        badges = self.db.query(Badge).all()
        if not badges:
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
        # Stub implementation — no DB logic yet
        print(f"[Stub] Assigned badge '{badge_key}' to user {user_id}")