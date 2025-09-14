from fastapi import APIRouter

router = APIRouter(prefix="/accounts", tags=["accounts"])

@router.put("/me")
def link_account(account_type: str, url: str):
    return {"account_type": account_type, "url": url}
