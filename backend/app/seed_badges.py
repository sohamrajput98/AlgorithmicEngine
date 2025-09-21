import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database import SessionLocal
from app.models.badge import Badge
from app.services.badge_service import HARDCODED_BADGES
db = SessionLocal()

for badge in HARDCODED_BADGES:
    exists = db.query(Badge).filter_by(key=badge["key"]).first()
    if not exists:
        new_badge = Badge(
            key=badge["key"],
            name=badge["name"],
            description=badge["description"],
            criteria_json="{}",
            icon_path=badge["image_url"]
        )
        db.add(new_badge)

db.commit()
db.close()
print("✅ Badges seeded successfully.")