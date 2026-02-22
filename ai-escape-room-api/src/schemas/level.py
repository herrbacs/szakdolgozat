from pydantic import BaseModel, Field

class RateLevelRequest(BaseModel):
    rate: int = Field(min=1, max=5)
