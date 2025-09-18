import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import get_db
from app import models

client = TestClient(app)


def test_submission_run(db_session):
    # Create a dummy problem with testcases
    problem = models.Problem(title="Sum", description="Add two numbers")
    db_session.add(problem)
    db_session.commit()
    db_session.refresh(problem)

    testcase1 = models.Testcase(problem_id=problem.id, input_data="10 20\n", expected_output="30")
    testcase2 = models.Testcase(problem_id=problem.id, input_data="1 2\n", expected_output="3")
    testcase3 = models.Testcase(problem_id=problem.id, input_data="5 7\n", expected_output="12")

    db_session.add_all([testcase1, testcase2, testcase3])
    db_session.commit()

    response = client.post(
        "/submissions/run",
        json={
            "problem_id": problem.id,
            "language": "python",
            "code": "a,b=map(int,input().split());print(a+b)"
        }
    )

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "accepted"
    assert data["passes"] == 3
    assert data["total"] == 3
