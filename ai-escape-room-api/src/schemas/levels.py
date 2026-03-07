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
    difficulty: int
    generated_at: datetime
    rating: Optional[float] = None
    favorite_count: int = 0
    total_tokens: int = 0
    total_minutes: float = 0.0
    repair_count: int = 0

class LevelListQuery(BaseModel):
    title: str | None = None
    story: str | None = None
    rating_gte: Literal[3, 4] | None = None
    difficulty: Literal[1, 2, 3, 4, 5] | None = None
    favorites_only: bool = False
