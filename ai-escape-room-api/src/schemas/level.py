from enum import Enum
from pydantic import BaseModel, Field

class SpriteStyle(str, Enum):
    CARTOON = "Cartoon"
    REALISTIC = "Realistic"

class RateLevelRequest(BaseModel):
    rate: int = Field(min=1, max=5)

class GenerateLevelRequest(BaseModel):
    difficulty: int = Field(default=3, min=1, max=5)
    sprite_style: SpriteStyle = Field(default=SpriteStyle.CARTOON)
    story: str = Field(default="", min_length=0, max_length=1000)

class EstimateTokensRequest(BaseModel):
    difficulty: int = Field(min=1, max=5)
