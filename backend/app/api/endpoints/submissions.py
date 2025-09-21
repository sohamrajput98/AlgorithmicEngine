from fastapi import APIRouter, HTTPException, Depends, Request, Query
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import tempfile, subprocess, os, shutil, textwrap, json

from sqlalchemy.orm import Session
from app.services.submission_service import SubmissionService
from app.dependencies import get_current_user
from app.database import get_db
from app.models.submission import Submission
from app.models.testcase import TestCase  # ✅ Import added
from app.schemas.submission import SubmissionOut
from app.models.problem import Problem  # ✅ Add this at the top if not already

router = APIRouter(prefix="/submissions", tags=["submissions"])
service = SubmissionService()

# ✅ Schema for incoming submission
class SubmissionIn(BaseModel):
    problem_id: int
    code: str
    language: str = "python"

# ✅ Run Python code in a sandboxed temp file
def _run_python(code: str, timeout: int = 2):
    tmpdir = tempfile.mkdtemp(prefix="submission_")
    try:
        path = os.path.join(tmpdir, "submission.py")
        with open(path, "w", encoding="utf-8") as f:
            f.write(textwrap.dedent(code))
        proc = subprocess.run(["python3", path],
                              capture_output=True, text=True, timeout=timeout)
        return proc.returncode, proc.stdout, proc.stderr
    finally:
        shutil.rmtree(tmpdir)

# ✅ Main submission endpoint (now returns full DB-backed response)
@router.post("/")
async def submit(request: Request):
    try:
        body = await request.json()
        print("RAW BODY:", body)
        sub = SubmissionIn(**body)
        print("Parsed Submission:", sub.dict())
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Payload error: {str(e)}")

    # ✅ Create submission record
    payload = sub.dict()
    payload["user_id"] = None  # or extract from request.state if needed
    print("Payload before submit_and_run:", payload)

    submission = service.submit_and_run(payload, run_sample_only=True)

    # ✅ Parse result_log to extract actual output
    try:
        logs = json.loads(submission.result_log)
        first_log = logs[0] if logs else {}
    except Exception:
        first_log = {}

    # ✅ Fetch sample test case for metadata
    tc = (
        service.db.query(TestCase)
        .filter(TestCase.problem_id == submission.problem_id, TestCase.is_sample == True)
        .first()
    )

    # ✅ Fetch problem for complexity metadata
    problem = (
        service.db.query(Problem)
        .filter(Problem.id == submission.problem_id)
        .first()
    )

    return {
        "id": submission.id,
        "problem_id": submission.problem_id,
        "status": submission.status,
        "output": first_log.get("stdout"),
        "expected": tc.expected_output if tc else None,
        "language": submission.language,
        "time_complexity": getattr(tc, "time_complexity", None),
        "space_complexity": getattr(tc, "space_complexity", None),
        "runtime": submission.runtime_ms,
        "memory": submission.memory_kb,
        "created_at": getattr(submission, "created_at", None),
        "stderr": first_log.get("stderr"),
    }

# ✅ Alternate route (already patched earlier)
@router.post("/run")
def submit_code(payload: Dict[str, Any], request: Request):
    current_user = getattr(request.state, "user", None)
    payload["user_id"] = getattr(current_user, "id", None) if current_user else None

    if "problem_id" not in payload or "code" not in payload:
        raise HTTPException(status_code=400, detail="problem_id and code are required")

    try:
        submission = service.submit_and_run(payload, run_sample_only=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    tc = (
        service.db.query(TestCase)
        .filter(TestCase.problem_id == submission.problem_id, TestCase.is_sample == True)
        .first()
    )

    return {
        "id": submission.id,
        "problem_id": submission.problem_id,
        "status": submission.status,
        "output": tc.expected_output if tc else None,
        "expected": tc.expected_output if tc else None,
        "language": submission.language,
        "time_complexity": getattr(tc, "time_complexity", None),
        "space_complexity": getattr(tc, "space_complexity", None),
        "runtime": submission.runtime_ms,
        "memory": submission.memory_kb,
        "created_at": getattr(submission, "created_at", None),
    }

# ✅ Get submissions for a user
@router.get("/", response_model=List[SubmissionOut])
def get_user_submissions(user_id: int = Query(...), db: Session = Depends(get_db)):
    return (
        db.query(Submission)
        .filter(Submission.user_id == user_id)
        .order_by(Submission.created_at.desc())
        .all()
    )