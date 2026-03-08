from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Any
from db.connection import get_db
from sqlalchemy.orm import Session
from sqlalchemy import select
from src.security.deps import get_current_user
from db.models.user import User
from src.schemas.level import (
    RateLevelRequest,
    GenerateLevelRequest,
    EstimateTokensRequest,
    EstimateTokensResponse,
    GenerateLevelResponse,
)
from src.schemas.levels import LevelListQuery, LevelCompletionRequest
from src.controllers.levels_controller import list_levels_handler, generate_new_level_handler, load_level_handler, rate_level_handler, add_to_favorite_handler, remove_from_favorite_handler, get_user_level_rating_handler, get_level_favorite_status_handler, record_level_completion_handler
from src.schemas.pagination import PaginationQuery, PagedResponse
from src.services.pagination_service import get_pagination
from src.services.level_service import get_average_tokens_for_difficulty
from db.models.user_tokens import UserTokens
from src.models.service_types import TokenEstimate, TokenEstimateResponse

router = APIRouter(prefix="/levels", tags=["levels"])

@router.get("/", response_model=PagedResponse)
def list_levels(
    pagination: PaginationQuery = Depends(get_pagination),
    query: LevelListQuery = Depends(),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
) -> PagedResponse[Any]:
    return list_levels_handler(pagination, db, query, user)

@router.post("/generate", response_model=GenerateLevelResponse)
def generate_level(
    req: GenerateLevelRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
) -> JSONResponse:
    return JSONResponse(content=generate_new_level_handler(req, db, user))

@router.post("/estimate-tokens", response_model=EstimateTokensResponse)
def estimate_tokens(
    req: EstimateTokensRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
) -> JSONResponse:
    estimate: TokenEstimate = get_average_tokens_for_difficulty(db, req.difficulty)
    estimated_tokens = estimate["tokens"]
    estimated_minutes = estimate["minutes"]
    user_tokens = db.execute(
        select(UserTokens).where(UserTokens.user_id == user.id)
    ).scalar_one_or_none()
    
    response: TokenEstimateResponse = {
        "estimated_tokens": estimated_tokens,
        "estimated_minutes": estimated_minutes,
        "current_balance": user_tokens.balance if user_tokens else 0,
        "sufficient": (user_tokens.balance if user_tokens else 0) >= estimated_tokens
    }
    return JSONResponse(content=response)

@router.get("/load/{level_id}")
def load_level(level_id: str) -> JSONResponse:
    return JSONResponse(load_level_handler(level_id))

@router.post("/rate/{level_id}")
def rate_level(
    level_id: str,
    req: RateLevelRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
) -> None:
    rate_level_handler(level_id, req, db, user)

@router.post("/favorite/{level_id}")
def add_to_favorite(
    level_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
) -> None:
    add_to_favorite_handler(level_id, db, user)

@router.delete("/favorite/{level_id}")
def remove_from_favorite(
    level_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
) -> None:
    remove_from_favorite_handler(level_id, db, user)

@router.get("/rating/{level_id}")
def get_user_level_rating(
    level_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
) -> dict[str, int | None]:
    return get_user_level_rating_handler(level_id, db, user)

@router.get("/is-favorite/{level_id}")
def get_level_favorite_status(
    level_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
) -> dict[str, bool]:
    return get_level_favorite_status_handler(level_id, db, user)


@router.post("/complete/{level_id}")
def record_level_completion(
    level_id: str,
    req: LevelCompletionRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> dict[str, bool]:
    return record_level_completion_handler(level_id, req, db, user)
