from backend.app.models.analytics import Analytics

def get_user_stats(user_id: int):
    # Dummy values for now
    return {"solved_count": 0, "accuracy": 0.0, "current_streak": 0, "longest_streak": 0}
