from app.models.badge import Badge

class BadgeService:
    def list_badges(self):
        # Just return all badges, no evaluation yet
        return [{"id": 1, "name": "Starter", "description": "First submission"}]