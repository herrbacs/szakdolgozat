from enum import Enum
from pydantic import BaseModel


class TokenCategory(str, Enum):
    basic = "basic"
    medium = "medium"
    high = "high"


class TokenPurchaseRequest(BaseModel):
    category: TokenCategory


class TokenPurchaseResponse(BaseModel):
    new_balance: int
