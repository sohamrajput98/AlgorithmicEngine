from fastapi import APIRouter

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/dashboard")
def dashboard():
    return {"message": "Admin dashboard (restricted)"}
