from pydantic import BaseModel
from typing import Literal


class TokenPurchaseRequest(BaseModel):
    category: Literal["basic", "medium", "high"]


class TokenPurchaseResponse(BaseModel):
    new_balance: int
