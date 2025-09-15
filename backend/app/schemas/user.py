from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# ---------------- Base Schemas ----------------
class UserBase(BaseModel):
    email: EmailStr
    display_name: Optional[str]

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    display_name: Optional[str]

# ---------------- Response Schemas ----------------
class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime

    class Config:
        orm_mode = True

# ---------------- Login / Token Schemas ----------------
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserOut(BaseModel):
    id: int
    email: str
    display_name: Optional[str]
    role: Optional[str]
    is_active: bool
    created_at: Optional[datetime]

    class Config:
        orm_mode = True