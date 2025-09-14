from fastapi import APIRouter

router = APIRouter(prefix="/badges", tags=["badges"])

BADGES = [
    {
        "key": "first_submission",
        "name": "First Submit",
        "description": "Submitted your first solution",
        "image_url": "/static/badges/first_submission.png"
    },
    {
        "key": "daily_streaker",
        "name": "Daily Streaker",
        "description": "Submitted code daily for 3 days",
        "image_url": "/static/badges/daily_streaker.png"
    },
    {
        "key": "streak_30",
        "name": "30-Day Streak",
        "description": "Solved problems 30 days in a row",
        "image_url": "/static/badges/streak_30.png"
    },
    {
        "key": "consistency_king",
        "name": "Consistency King",
        "description": "Submitted code consistently for 7 days",
        "image_url": "/static/badges/consistency_king.png"
    },
    {
        "key": "algo_explorer",
        "name": "Algo Explorer",
        "description": "Explored 10 different problems",
        "image_url": "/static/badges/algo_explorer.png"
    },
    {
        "key": "bug_slayer",
        "name": "Bug Slayer",
        "description": "Solved a tricky problem",
        "image_url": "/static/badges/bug_slayer.png"
    },
    {
        "key": "logic_master",
        "name": "Logic Master",
        "description": "Solved 10 problems",
        "image_url": "/static/badges/logic_master.png"
    },
    {
        "key": "never_give_up",
        "name": "Never Give Up",
        "description": "Kept submitting despite failures",
        "image_url": "/static/badges/never_give_up.png"
    },
    {
        "key": "speed_coder",
        "name": "Speed Coder",
        "description": "Solved a problem in under 5 minutes",
        "image_url": "/static/badges/speed_coder.png"
    },
    {
        "key": "final_mastery",
        "name": "Final Badge",
        "description": "Completed all problems",
        "image_url": "/static/badges/final_mastery.png"
    }
]

@router.get("/")
async def list_badges():
    return BADGES