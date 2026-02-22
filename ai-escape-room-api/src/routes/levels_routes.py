from fastapi import APIRouter, Depends
from db.connection import get_db
from sqlalchemy.orm import Session
from src.security.deps import get_current_user
from db.models.user import User
from fastapi import APIRouter, Depends
from src.controllers.levels_controller import list_levels_handler
from src.schemas.pagination import PaginationQuery, PagedResponse
from src.services.pagination_service import get_pagination

router = APIRouter(prefix="/levels", tags=["levels"])

@router.get("", response_model=PagedResponse)
def list_levels(
    pagination: PaginationQuery = Depends(get_pagination),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user)
): return list_levels_handler(pagination, db)
