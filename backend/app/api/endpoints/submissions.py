from fastapi import APIRouter

router = APIRouter(prefix="/submissions", tags=["submissions"])

@router.post("/")
def submit_code(problem_id: int, code: str, language: str):
    return {"submission_id": 1, "status": "queued"}

@router.get("/{submission_id}")
def check_submission(submission_id: int):
    return {"submission_id": submission_id, "status": "accepted"}
