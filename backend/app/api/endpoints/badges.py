from fastapi import APIRouter

router = APIRouter(prefix="/badges", tags=["badges"])

@router.get("/")
def list_badges():
    return [{"id": 1, "name": "First Solve"}]
