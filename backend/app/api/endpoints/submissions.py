from fastapi import APIRouter, HTTPException, Depends, Request, Query
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import tempfile, subprocess, os, shutil, textwrap, json

from sqlalchemy.orm import Session
from app.services.submission_service import SubmissionService
from app.dependencies import get_current_user, get_db
from app.models.submission import Submission
from app.models.testcase import TestCase
from app.schemas.submission import SubmissionOut
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

@router.post("/")
async def submit(
    request: Request,
    current_user: User = Depends(get_current_user)
):
    try:
        body = await request.json()
        print("RAW BODY:", body)
        sub = SubmissionIn(**body)
        print("Parsed Submission:", sub.dict())
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Payload error: {str(e)}")

    payload = sub.dict()
    payload["user_id"] = current_user.id
    print("Payload before submit_and_run:", payload)

    submission = service.submit_and_run(payload, run_sample_only=True)

    try:
        logs = json.loads(submission.result_log)
        first_log = logs[0] if logs else {}
    except Exception:
        first_log = {}

    tc = (
        service.db.query(TestCase)
        .filter(TestCase.problem_id == submission.problem_id, TestCase.is_sample == True)
        .first()
    )

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

@router.post("/run")
def submit_code(
    payload: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    payload["user_id"] = current_user.id

    if "problem_id" not in payload or "code" not in payload:
        raise HTTPException(status_code=400, detail="problem_id and code are required")

    try:
        submission = service.submit_and_run(payload, run_sample_only=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # ✅ Extract actual output from result_log
    try:
        logs = json.loads(submission.result_log)
        first_log = logs[0] if logs else {}
    except Exception:
        first_log = {}

    # ✅ Fetch sample testcase for complexity
    tc = (
        service.db.query(TestCase)
        .filter(TestCase.problem_id == submission.problem_id, TestCase.is_sample == True)
        .first()
    )

    return {
        "id": submission.id,
        "problem_id": submission.problem_id,
        "status": submission.status,
        "output": first_log.get("stdout"),  # ✅ Actual output
        "expected": tc.expected_output if tc else None,
        "language": submission.language,
        "time_complexity": getattr(tc, "time_complexity", None),
        "space_complexity": getattr(tc, "space_complexity", None),
        "runtime": submission.runtime_ms,
        "memory": submission.memory_kb,
        "created_at": getattr(submission, "created_at", None),
        "stderr": first_log.get("stderr"),
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
        try:
          logs = json.loads(sub.result_log)
          first_log = logs[0] if logs else {}
        except Exception:
          first_log = {}

        tc = (
            db.query(TestCase)
            .filter(TestCase.problem_id == sub.problem_id, TestCase.is_sample == True)
            .first()
        )

        enriched.append({
            "id": sub.id,
            "problem_id": sub.problem_id,
            "status": sub.status,
            "output": first_log.get("stdout"),
            "expected": tc.expected_output if tc else None,
            "language": sub.language,
            "time_complexity": getattr(tc, "time_complexity", None),
            "space_complexity": getattr(tc, "space_complexity", None),
            "runtime": sub.runtime_ms,
            "memory": sub.memory_kb,
            "created_at": sub.created_at,
            "stderr": first_log.get("stderr"),
        })

    return enriched