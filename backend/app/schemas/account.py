from pydantic import BaseModel, HttpUrl
from typing import Optional


class AccountBase(BaseModel):
    type: str  # "github", "linkedin"
    url: HttpUrl
    username: Optional[str] = None


class AccountCreate(AccountBase):
    user_id: int


class AccountResponse(AccountBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True
