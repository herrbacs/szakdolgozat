from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from db.connection import get_db
from sqlalchemy.orm import Session
from src.security.deps import get_current_user
from db.models.user import User
from src.schemas.level import RateLevelRequest
from src.controllers.level_controller import generate_new_level_handler, load_level_handler, rate_level_handler, add_to_favorite_handler, remove_from_favorite_handler
from src.schemas.levels import PagedLevelsResponse, LevelListItem
from fastapi import APIRouter, Depends, Query
from src.controllers.levels_controller import list_levels_handler

router = APIRouter(prefix="/levels", tags=["levels"])

@router.get("", response_model=PagedLevelsResponse)
def list_levels(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user)
): return list_levels_handler(page, page_size, db)
