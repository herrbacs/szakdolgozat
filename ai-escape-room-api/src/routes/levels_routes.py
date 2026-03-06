from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from db.connection import get_db
from sqlalchemy.orm import Session
from src.security.deps import get_current_user
from db.models.user import User
from src.schemas.level import RateLevelRequest
from src.schemas.levels import LevelListQuery
from src.controllers.levels_controller import list_levels_handler, list_favorites_handler, generate_new_level_handler, load_level_handler, rate_level_handler, add_to_favorite_handler, remove_from_favorite_handler, get_user_level_rating_handler, get_level_favorite_status_handler
from src.schemas.pagination import PaginationQuery, PagedResponse
from src.services.pagination_service import get_pagination

router = APIRouter(prefix="/levels", tags=["levels"])

@router.get("/", response_model=PagedResponse)
def list_levels(
    pagination: PaginationQuery = Depends(get_pagination),
    query: LevelListQuery = Depends(),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user)
): return list_levels_handler(pagination, db, query)

@router.get("/favorites", response_model=PagedResponse)
def list_favorites(
    pagination: PaginationQuery = Depends(get_pagination),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
): return list_favorites_handler(pagination, db, user)

@router.post("/generate")
def generate_level(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return JSONResponse(content=generate_new_level_handler(db, user))

@router.get("/load/{level_id}")
def load_level(level_id: str):
    return JSONResponse(load_level_handler(level_id))

@router.post("/rate/{level_id}")
def rate_level(
    level_id: str,
    req: RateLevelRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
): rate_level_handler(level_id, req, db, user)

@router.post("/favorite/{level_id}")
def add_to_favorite(
    level_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
): add_to_favorite_handler(level_id, db, user)

@router.delete("/favorite/{level_id}")
def remove_from_favorite(
    level_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
): remove_from_favorite_handler(level_id, db, user)

@router.get("/rating/{level_id}")
def get_user_level_rating(
    level_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return get_user_level_rating_handler(level_id, db, user)

@router.get("/is-favorite/{level_id}")
def get_level_favorite_status(
    level_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return get_level_favorite_status_handler(level_id, db, user)
