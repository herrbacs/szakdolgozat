from pydantic import BaseModel, Field
from typing import List, Optional
import uuid

class RateLevelRequest(BaseModel):
    rate: int = Field(min=1, max=5)

class LevelListItem(BaseModel):
    id: uuid.UUID
    title: str
    story: str
    rating: Optional[float] = None  # nincs rating -> None

class PagedLevelsResponse(BaseModel):
    items: List[LevelListItem]
    page: int
    page_size: int
    total: int
    total_pages: int