import time
from typing import Dict, Any

from app.database import SessionLocal
from app.models.submission import Submission
from app.models.testcase import TestCase
from app.schemas.submission import SubmissionCreate
from app.utils.sandbox_runner import run_python

class SubmissionService:
    def __init__(self):
        self.db = SessionLocal()

    def create_submission(self, sub: SubmissionCreate) -> Submission:
        db_sub = Submission(
            user_id=sub.user_id,
            problem_id=sub.problem_id,
            code=sub.code,
            language=sub.language,
            status="queued"
        )
        self.db.add(db_sub)
        self.db.commit()
        self.db.refresh(db_sub)
        return db_sub

    def list_submissions(self, user_id: int) -> list[Submission]:
        return self.db.query(Submission).filter(Submission.user_id == user_id).all()

    def create_submission_record(self, payload: Dict[str, Any]) -> Submission:
        s = Submission(
            problem_id=payload.get("problem_id"),
            user_id=payload.get("user_id"),
            code=payload.get("code"),
            language=payload.get("language", "python"),
            status="queued",
            result_log="",
            passes=0,
            total=0,
            runtime_ms=0,
            memory_kb=0
        )
        self.db.add(s)
        self.db.commit()
        self.db.refresh(s)
        return s

    def evaluate_submission(self, submission_id: int, run_sample_only: bool = True) -> Submission:
        s: Submission = self.db.query(Submission).filter(Submission.id == submission_id).first()
        if not s:
            raise ValueError("submission not found")

        s.status = "running"
        self.db.commit()

        if run_sample_only:
            tcs = self.db.query(TestCase).filter(TestCase.problem_id == s.problem_id, TestCase.is_sample == True).all()
        else:
            tcs = self.db.query(TestCase).filter(TestCase.problem_id == s.problem_id).all()

        total = len(tcs)
        passes = 0
        logs = []
        total_runtime = 0

        for tc in tcs:
            code = s.code or ""
            input_data = tc.input_data or ""
            time_limit_ms = getattr(tc, "time_limit_ms", 1000) or 1000
            memory_limit_kb = getattr(tc, "memory_limit_kb", 65536) or 65536

            try:
                res = run_python(code, stdin_data=input_data, time_limit_ms=time_limit_ms, memory_limit_kb=memory_limit_kb)
            except Exception as e:
                res = {"stdout": "", "stderr": f"[runner error] {e}", "returncode": -1, "runtime_ms": 0, "status": "error"}

            ok = False
            stdout = (res.get("stdout") or "").strip()
            stderr = res.get("stderr") or ""
            expected = (tc.expected_output or "").strip()

            if stdout == expected and res.get("returncode") == 0:
                ok = True

            log_entry = {
                "testcase_id": tc.id,
                "ok": ok,
                "stdout": stdout,
                "stderr": stderr,
                "runtime_ms": res.get("runtime_ms", 0),
            }
            logs.append(log_entry)

            if ok:
                passes += 1
            total_runtime += res.get("runtime_ms", 0)

        s.total = total
        s.passes = passes
        s.runtime_ms = total_runtime
        s.result_log = str(logs)
        s.status = "accepted" if passes == total and total > 0 else ("failed" if passes < total else "error")
        self.db.commit()
        self.db.refresh(s)
        return s

    def submit_and_run(self, payload: Dict[str, Any], run_sample_only: bool = True) -> Submission:
        s = self.create_submission_record(payload)
        return self.evaluate_submission(s.id, run_sample_only=run_sample_only)