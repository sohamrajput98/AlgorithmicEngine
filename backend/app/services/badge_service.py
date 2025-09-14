from backend.app.models.badge import Badge

def list_badges():
    # Just return all badges, no evaluation yet
    return [{"id": 1, "name": "Starter", "description": "First submission"}]
