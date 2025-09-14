# backend/app/api/endpoints/submissions.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import tempfile, subprocess, os, shutil, textwrap

router = APIRouter(prefix="/submissions", tags=["submissions"])

class SubmissionIn(BaseModel):
    problem_id: int
    code: str
    language: str = "python"

def _run_python(code: str, timeout: int = 2):
    # write code to temp file and run with python3
    tmpdir = tempfile.mkdtemp(prefix="submission_")
    try:
        path = os.path.join(tmpdir, "submission.py")
        # ensure newline at EOF
        with open(path, "w", encoding="utf-8") as f:
            f.write(textwrap.dedent(code))
        proc = subprocess.run(["python3", path],
                              capture_output=True, text=True, timeout=timeout)
        return proc.returncode, proc.stdout, proc.stderr
    finally:
        shutil.rmtree(tmpdir)

@router.post("/")
async def submit(sub: SubmissionIn):
    # lazy import to avoid cycles
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
