# backend/app/api/endpoints/testcases.py
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Body, Query, Response
from typing import List, Optional
from fastapi.responses import JSONResponse, StreamingResponse

from app.schemas.testcase import TestCaseCreate, TestCaseResponse, TestCaseUpdate
from app.services.testcase_service import TestCaseService

import io
# Try to use your project's dependency helpers. If they don't exist, you can create simple stubs.
try:
    from app.dependencies import get_current_user, require_admin  # your project likely has these
except Exception:
    # Fallback stubs (not secure — replace with your real dependencies)
    def get_current_user():
        # placeholder for dependency injection
        return None

    def require_admin():
        # placeholder; in real project check user.role == "admin"
        return None

router = APIRouter(prefix="/testcases", tags=["testcases"])
service = TestCaseService()

# ---------------- Student / Public routes ----------------

@router.get("/problem/{problem_id}", response_model=List[TestCaseResponse])
def list_sample_testcases(problem_id: int):
    """
    Return only sample testcases (hidden ones excluded).
    """
    tcs = service.list_testcases(problem_id=problem_id, include_hidden=False)
    return tcs

@router.get("/{testcase_id}", response_model=TestCaseResponse)
def get_testcase(testcase_id: int, current_user=Depends(get_current_user)):
    tc = service.get_testcase(testcase_id)
    if not tc:
        raise HTTPException(status_code=404, detail="Testcase not found")
    # Students should not fetch hidden testcases directly unless they have admin rights.
    if not tc.is_sample:
        # allow admin
        if not current_user:
            raise HTTPException(status_code=404, detail="Testcase not found")
        # optionally check admin role in require_admin / current_user
    return tc

# ---------------- Admin routes (protected) ----------------

@router.post("/problem/{problem_id}", response_model=TestCaseResponse, dependencies=[Depends(require_admin)])
def create_testcase(problem_id: int, payload: TestCaseCreate):
    # ensure payload.problem_id matches route
    if payload.problem_id != problem_id:
        raise HTTPException(status_code=400, detail="problem_id mismatch")
    tc = service.create_testcase(payload)
    return tc

@router.put("/{testcase_id}", response_model=TestCaseResponse, dependencies=[Depends(require_admin)])
def update_testcase(testcase_id: int, payload: TestCaseUpdate):
    tc = service.update_testcase(testcase_id, payload)
    if not tc:
        raise HTTPException(status_code=404, detail="Testcase not found")
    return tc

@router.delete("/{testcase_id}", dependencies=[Depends(require_admin)])
def delete_testcase(testcase_id: int):
    ok = service.delete_testcase(testcase_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Testcase not found")
    return {"ok": True}

# ---------------- Bulk import/export (admin) ----------------

@router.post("/problem/{problem_id}/bulk_import/json", dependencies=[Depends(require_admin)])
async def bulk_import_json(problem_id: int, payload: List[dict] = Body(...)):
    """
    Accepts JSON body: list of testcases like:
    [
      {"input_data":"1 2","expected_output":"3","is_sample":true,"time_limit_ms":1000}
    ]
    """
    created = service.bulk_import_json(problem_id, payload)
    return {"imported": len(created)}

@router.post("/problem/{problem_id}/bulk_import/csv", dependencies=[Depends(require_admin)])
async def bulk_import_csv(problem_id: int, file: UploadFile = File(...), delimiter: Optional[str] = Query(",", max_length=1)):
    """
    Upload a CSV file. Columns: input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb
    """
    raw = await file.read()
    created = service.bulk_import_csv(problem_id, raw, delimiter=delimiter)
    return {"imported": len(created)}

@router.get("/problem/{problem_id}/export", dependencies=[Depends(require_admin)])
def export_testcases(problem_id: int, format: Optional[str] = Query("json", regex="^(json|csv)$"), include_hidden: bool = Query(True)):
    """
    Export testcases for a problem. format=json|csv
    """
    if format == "json":
        data = service.export_json(problem_id, include_hidden=include_hidden)
        return JSONResponse(content=data)
    else:
        # csv
        csv_bytes = service.export_csv_bytes(problem_id, include_hidden=include_hidden)
        return StreamingResponse(io.BytesIO(csv_bytes), media_type="text/csv",
                                 headers={"Content-Disposition": f"attachment; filename=problem_{problem_id}_testcases.csv"})
