from __future__ import annotations

from typing import Any, TypedDict
import uuid


class TokenEstimate(TypedDict):
    tokens: int
    minutes: float


class TokenUsage(TypedDict):
    input_tokens: int
    output_tokens: int
    total_tokens: int


class TokenBreakdown(TypedDict):
    generation_tokens: int
    generation_minutes: float
    validation_tokens: int
    validation_minutes: float
    repair_tokens: int
    repair_minutes: float
    sprite_tokens: int
    sprite_minutes: float
    total_tokens: int
    total_minutes: float
    repair_count: int


class LevelGenerationResult(TypedDict):
    success: bool
    level: dict[str, Any] | None
    level_id: str | None
    tokens: TokenBreakdown


class FoundObjectWithPath(TypedDict):
    object: dict[str, Any]
    path: tuple[str | int, ...]
    is_exit: bool


class ProfileData(TypedDict):
    id: uuid.UUID
    email: str
    username: str
    tokens: int


class TokenEstimateResponse(TypedDict):
    estimated_tokens: int
    estimated_minutes: float
    current_balance: int
    sufficient: bool
