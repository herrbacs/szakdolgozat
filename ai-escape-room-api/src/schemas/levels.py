from pydantic import BaseModel, Field
from typing import Optional
from typing import Literal
import uuid
from datetime import datetime

class RateLevelRequest(BaseModel):
    rate: int = Field(min=1, max=5)

class LevelListItem(BaseModel):
    id: uuid.UUID
    title: str
    story: str
    generated_at: datetime
    rating: Optional[float] = None
    favorite_count: int = 0

class LevelListQuery(BaseModel):
    title: str | None = None
    story: str | None = None
    rating_gte: Literal[3, 4] | None = None
