from fastapi import APIRouter

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/me")
def get_my_analytics():
    return {"solved_count": 10, "accuracy": 80}
