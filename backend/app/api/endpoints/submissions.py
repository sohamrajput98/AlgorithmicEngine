from fastapi import APIRouter, HTTPException, Depends, Request, Query
from pydantic import BaseModel
from typing import Dict, Any, List
import tempfile, subprocess, os, shutil, textwrap, json

from sqlalchemy.orm import Session
from app.services.submission_service import SubmissionService
from app.dependencies import get_current_user, get_db
from app.models.submission import Submission
from app.models.testcase import TestCase
from app.models.problem import Problem
from app.models.user import User

router = APIRouter(prefix="/submissions", tags=["submissions"])
service = SubmissionService()

class SubmissionIn(BaseModel):
    problem_id: int
    code: str
    language: str = "python"

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

def merge_testcase_logs(submission: Submission) -> List[Dict[str, Any]]:
    """Merge submission logs with all sample testcases."""
    try:
        logs = json.loads(submission.result_log)
    except Exception:
        logs = []

    tcs = (
        service.db.query(TestCase)
        .filter(TestCase.problem_id == submission.problem_id, TestCase.is_sample == True)
        .all()
    )

    merged_logs = []
    for idx, tc in enumerate(tcs):
        log = logs[idx] if idx < len(logs) else {}
        merged_logs.append({
            "case_number": idx + 1,
            "input": tc.input_data,
            "output": log.get("output", "—"),
            "expected": tc.expected_output,
            "status": log.get("status", "Pending"),
            "error": log.get("error"),
            "runtime_ms": log.get("runtime_ms"),
            "time_complexity": tc.time_complexity,
            "space_complexity": tc.space_complexity
        })
    return merged_logs

@router.post("/")
async def submit(request: Request, current_user: User = Depends(get_current_user)):
    try:
        body = await request.json()
        sub = SubmissionIn(**body)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Payload error: {str(e)}")

    payload = sub.dict()
    payload["user_id"] = current_user.id
    submission = service.submit_and_run(payload, run_sample_only=True)

    return {
        "id": submission.id,
        "problem_id": submission.problem_id,
        "status": submission.status,
        "passes": submission.passes,
        "total": submission.total,
        "runtime": submission.runtime_ms,
        "result_log": merge_testcase_logs(submission),
        "language": submission.language,
        "memory": submission.memory_kb,
        "created_at": getattr(submission, "created_at", None),
    }

@router.post("/run")
def submit_code(payload: Dict[str, Any], current_user: User = Depends(get_current_user)):
    payload["user_id"] = current_user.id
    if "problem_id" not in payload or "code" not in payload:
        raise HTTPException(status_code=400, detail="problem_id and code are required")

    submission = service.submit_and_run(payload, run_sample_only=False)
    return {
        "id": submission.id,
        "problem_id": submission.problem_id,
        "status": submission.status,
        "passes": submission.passes,
        "total": submission.total,
        "runtime": submission.runtime_ms,
        "result_log": merge_testcase_logs(submission),
        "language": submission.language,
        "memory": submission.memory_kb,
        "created_at": getattr(submission, "created_at", None),
    }

@router.get("/")
def get_user_submissions(user_id: int = Query(...), db: Session = Depends(get_db)):
    submissions = (
        db.query(Submission)
        .filter(Submission.user_id == user_id)
        .order_by(Submission.created_at.desc())
        .all()
    )

    enriched = []
    for sub in submissions:
        enriched.append({
            "id": sub.id,
            "problem_id": sub.problem_id,
            "status": sub.status,
            "passes": sub.passes,
            "total": sub.total,
            "runtime": sub.runtime_ms,
            "result_log": merge_testcase_logs(sub),
            "language": sub.language,
            "memory": sub.memory_kb,
            "created_at": sub.created_at,
        })
    return enriched
