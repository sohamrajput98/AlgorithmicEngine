from pydantic import BaseModel
from typing import Optional


class FeatureFlagBase(BaseModel):
    key: str
    enabled: bool


class FeatureFlagCreate(FeatureFlagBase):
    meta: Optional[dict] = None


class FeatureFlagResponse(FeatureFlagBase):
    id: int

    class Config:
        orm_mode = True
