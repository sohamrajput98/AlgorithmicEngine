# backend/app/services/testcase_service.py
import csv
import io
import json
from typing import List, Optional, Iterable, Dict

from app.models.testcase import TestCase
from app.schemas.testcase import TestCaseCreate, TestCaseUpdate
from app.database import SessionLocal

class TestCaseService:
    def __init__(self):
        # matches your existing pattern; one session per service instance
        self.db = SessionLocal()

    def create_testcase(self, testcase: TestCaseCreate) -> TestCase:
        db_testcase = TestCase(
            problem_id=testcase.problem_id,
            input_data=testcase.input_data,
            expected_output=testcase.expected_output,
            is_sample=testcase.is_sample,
            time_limit_ms=testcase.time_limit_ms or 1000,
            memory_limit_kb=testcase.memory_limit_kb or 65536
        )
        self.db.add(db_testcase)
        self.db.commit()
        self.db.refresh(db_testcase)
        return db_testcase

    def list_testcases(self, problem_id: int, include_hidden: bool = False) -> List[TestCase]:
        q = self.db.query(TestCase).filter(TestCase.problem_id == problem_id)
        if not include_hidden:
          q = q.filter(TestCase.is_sample == True)
        result = q.order_by(TestCase.id).all()
        print(f"[DEBUG] Fetched {len(result)} testcases for problem_id={problem_id}, include_hidden={include_hidden}")
        return result

    def get_testcase(self, testcase_id: int) -> Optional[TestCase]:
        return self.db.query(TestCase).filter(TestCase.id == testcase_id).first()

    def update_testcase(self, testcase_id: int, data: TestCaseUpdate) -> Optional[TestCase]:
        tc = self.get_testcase(testcase_id)
        if not tc:
            return None
        update_data = data.dict(exclude_unset=True)
        for k, v in update_data.items():
            setattr(tc, k, v)
        self.db.commit()
        self.db.refresh(tc)
        return tc

    def delete_testcase(self, testcase_id: int) -> bool:
        tc = self.get_testcase(testcase_id)
        if not tc:
            return False
        self.db.delete(tc)
        self.db.commit()
        return True

    # ---------------- Bulk operations ----------------

    def bulk_import_json(self, problem_id: int, json_list: Iterable[Dict]) -> List[TestCase]:
        """
        json_list: iterable of dicts with keys input_data, expected_output, optional is_sample, time_limit_ms, memory_limit_kb
        """
        created = []
        for entry in json_list:
            payload = TestCaseCreate(
                problem_id=problem_id,
                input_data=entry.get("input_data", ""),
                expected_output=entry.get("expected_output", ""),
                is_sample=entry.get("is_sample", False),
                time_limit_ms=entry.get("time_limit_ms"),
                memory_limit_kb=entry.get("memory_limit_kb")
            )
            created.append(self.create_testcase(payload))
        return created

    def bulk_import_csv(self, problem_id: int, csv_bytes: bytes, delimiter: str = ",") -> List[TestCase]:
        """
        CSV expected columns: input_data, expected_output, is_sample (optional), time_limit_ms (optional), memory_limit_kb (optional)
        """
        text = csv_bytes.decode("utf-8")
        reader = csv.DictReader(io.StringIO(text), delimiter=delimiter)
        records = []
        for row in reader:
            # normalize keys: prefer exact names
            input_data = row.get("input_data") or row.get("input") or row.get("inputData") or ""
            expected_output = row.get("expected_output") or row.get("output") or row.get("expectedOutput") or ""
            is_sample = row.get("is_sample", "false").lower() in ("1", "true", "yes")
            time_limit_ms = int(row["time_limit_ms"]) if row.get("time_limit_ms") else None
            memory_limit_kb = int(row["memory_limit_kb"]) if row.get("memory_limit_kb") else None
            payload = TestCaseCreate(
                problem_id=problem_id,
                input_data=input_data,
                expected_output=expected_output,
                is_sample=is_sample,
                time_limit_ms=time_limit_ms,
                memory_limit_kb=memory_limit_kb
            )
            records.append(payload)
        # create all
        created = []
        for p in records:
            created.append(self.create_testcase(p))
        return created

    def export_json(self, problem_id: int, include_hidden: bool = True) -> List[Dict]:
        tcs = self.list_testcases(problem_id, include_hidden=include_hidden)
        out = []
        for tc in tcs:
            out.append({
                "id": tc.id,
                "problem_id": tc.problem_id,
                "input_data": tc.input_data,
                "expected_output": tc.expected_output,
                "is_sample": bool(tc.is_sample),
                "time_limit_ms": tc.time_limit_ms,
                "memory_limit_kb": tc.memory_limit_kb
            })
        return out

    def export_csv_bytes(self, problem_id: int, include_hidden: bool = True, delimiter: str = ",") -> bytes:
        records = self.export_json(problem_id, include_hidden=include_hidden)
        if not records:
            # return header-only CSV
            header = ["id", "problem_id", "input_data", "expected_output", "is_sample", "time_limit_ms", "memory_limit_kb"]
            return (delimiter.join(header) + "\n").encode("utf-8")
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=list(records[0].keys()), delimiter=delimiter)
        writer.writeheader()
        for r in records:
            writer.writerow(r)
        return output.getvalue().encode("utf-8")
