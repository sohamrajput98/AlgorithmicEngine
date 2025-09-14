from backend.app.models.testcase import TestCase
from backend.app.schemas.testcase import TestCaseCreate
from backend.app.database import SessionLocal

class TestCaseService:
    def __init__(self):
        self.db = SessionLocal()

    def create_testcase(self, testcase: TestCaseCreate) -> TestCase:
        db_testcase = TestCase(
            problem_id=testcase.problem_id,
            input_data=testcase.input_data,
            expected_output=testcase.expected_output,
            is_sample=testcase.is_sample,
            time_limit_ms=testcase.time_limit_ms,
            memory_limit_kb=testcase.memory_limit_kb
        )
        self.db.add(db_testcase)
        self.db.commit()
        self.db.refresh(db_testcase)
        return db_testcase

    def list_testcases(self, problem_id: int) -> list[TestCase]:
        return self.db.query(TestCase).filter(TestCase.problem_id == problem_id).all()