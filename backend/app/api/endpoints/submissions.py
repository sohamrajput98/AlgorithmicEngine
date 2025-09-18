from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any
import tempfile, subprocess, os, shutil, textwrap

from fastapi import Request
from app.services.submission_service import SubmissionService
from app.dependencies import get_current_user  # optional

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
async def submit(sub: SubmissionIn):
    from app.api.endpoints.problems import DUMMY_PROBLEMS
    prob = next((p for p in DUMMY_PROBLEMS if p["id"] == sub.problem_id), None)
    if prob is None:
        raise HTTPException(status_code=404, detail="Problem not found")
    if sub.language.lower() != "python":
        raise HTTPException(status_code=400, detail="Only python supported in demo")

    try:
        rc, out, err = _run_python(sub.code, timeout=2)
    except subprocess.TimeoutExpired:
        return {"status": "error", "reason": "timeout"}

    output = out.strip()
    expected = str(prob.get("sample_output", "")).strip()
    passed = (output == expected)

    return {
        "status": "passed" if passed else "failed",
        "output": output,
        "stderr": err.strip(),
        "expected": expected,
    }


@router.post("/run")
def submit_code(payload: Dict[str, Any], request: Request):
    # Try to extract user from request state (if middleware sets it)
    current_user = getattr(request.state, "user", None)

    if current_user:
        payload["user_id"] = getattr(current_user, "id", None)
    else:
        # Optional: assign a dummy user_id or skip it entirely
        payload["user_id"] = None  # or use a default like 0

    if "problem_id" not in payload or "code" not in payload:
        raise HTTPException(status_code=400, detail="problem_id and code are required")

    try:
        submission = service.submit_and_run(payload, run_sample_only=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "id": submission.id,
        "problem_id": submission.problem_id,
        "status": submission.status,
        "passes": submission.passes,
        "total": submission.total,
        "runtime_ms": submission.runtime_ms,
        "result_log": submission.result_log,
        "created_at": getattr(submission, "created_at", None)
    }