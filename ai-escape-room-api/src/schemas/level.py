from pydantic import BaseModel, Field
from src.models.sprite_style import SpriteStyle

class RateLevelRequest(BaseModel):
    rate: int = Field(min=1, max=5)

class GenerateLevelRequest(BaseModel):
    level_id: str | None = None
    difficulty: int = Field(default=3, min=1, max=5)
    sprite_style: SpriteStyle = Field(default=SpriteStyle.CARTOON)
    story: str = Field(default="", min_length=0, max_length=1000)

class EstimateTokensRequest(BaseModel):
    difficulty: int = Field(min=1, max=5)


class EstimateTokensResponse(BaseModel):
    estimated_tokens: int
    estimated_minutes: float
    current_balance: int
    sufficient: bool


class GenerateLevelResponse(BaseModel):
    level_id: str
    level: dict
    tokens: dict
