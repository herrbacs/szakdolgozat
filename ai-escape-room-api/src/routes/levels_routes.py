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
    """Lists generated levels with pagination, filtering, and aggregate statistics.

    Request: query params `page`, `page_size`, and optionally `title`, `story`,
    `rating_gte`, `difficulty`, `favorites_only`; authentication required.
    Response: paged result with `items`, `page`, `page_size`, `total`, `total_pages`.
    """
    return list_levels_handler(pagination, db, query, user)

@router.post("/generate", response_model=GenerateLevelResponse)
def generate_level(
    req: GenerateLevelRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
) -> JSONResponse:
    """Generates a new level with the requested difficulty, story, and sprite style.

    Request body: `level_id` (optional), `difficulty`, `sprite_style`, `story`;
    authentication required.
    Response: `level_id`, the generated `level` object, and a `tokens` usage breakdown.
    """
    return JSONResponse(content=generate_new_level_handler(req, db, user))

@router.post("/estimate-tokens", response_model=EstimateTokensResponse)
def estimate_tokens(
    req: EstimateTokensRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
) -> JSONResponse:
    """Estimates the token and time cost of a level generation request.

    Request body: `difficulty`; authentication required.
    Response: `estimated_tokens`, `estimated_minutes`, `current_balance`, `sufficient`.
    """
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
    """Loads the stored final JSON representation of a level.

    Request: `level_id` path parameter.
    Response: the full contents of `final_level.json`.
    """
    return JSONResponse(load_level_handler(level_id))

@router.post("/rate/{level_id}")
def rate_level(
    level_id: str,
    req: RateLevelRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
) -> None:
    """Creates or updates a rating for a level.

    Request: `level_id` path parameter, body `rate` between 1 and 5; authentication required.
    Response: empty success response.
    """
    rate_level_handler(level_id, req, db, user)

@router.post("/favorite/{level_id}")
def add_to_favorite(
    level_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
) -> None:
    """Adds a level to the authenticated user's favorites.

    Request: `level_id` path parameter; authentication required.
    Response: empty success response.
    """
    add_to_favorite_handler(level_id, db, user)

@router.delete("/favorite/{level_id}")
def remove_from_favorite(
    level_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
) -> None:
    """Removes a level from the authenticated user's favorites.

    Request: `level_id` path parameter; authentication required.
    Response: empty success response.
    """
    remove_from_favorite_handler(level_id, db, user)

@router.get("/rating/{level_id}")
def get_user_level_rating(
    level_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
) -> dict[str, int | None]:
    """Returns the authenticated user's rating for the given level.

    Request: `level_id` path parameter; authentication required.
    Response: `rating`, which can be `null` if the level has not been rated yet.
    """
    return get_user_level_rating_handler(level_id, db, user)

@router.get("/is-favorite/{level_id}")
def get_level_favorite_status(
    level_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
) -> dict[str, bool]:
    """Returns whether the given level is in the authenticated user's favorites.

    Request: `level_id` path parameter; authentication required.
    Response: boolean `is_favorite`.
    """
    return get_level_favorite_status_handler(level_id, db, user)


@router.post("/complete/{level_id}")
def record_level_completion(
    level_id: str,
    req: LevelCompletionRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> dict[str, bool]:
    """Stores that the user completed the level in the given amount of time.

    Request: `level_id` path parameter, body `completion_minutes`; authentication required.
    Response: `saved`, indicating whether a new completion record was created.
    """
    return record_level_completion_handler(level_id, req, db, user)
