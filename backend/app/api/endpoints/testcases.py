from fastapi import APIRouter

router = APIRouter(prefix="/testcases", tags=["testcases"])

@router.post("/{problem_id}")
def add_testcase(problem_id: int, input_data: str, expected_output: str):
    return {"problem_id": problem_id, "input": input_data, "output": expected_output}
