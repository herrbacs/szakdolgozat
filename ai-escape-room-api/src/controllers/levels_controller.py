from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import select, func
import math
from db.connection import get_db
from db.models.level import Level
from db.models.level_rating import LevelRating
from src.schemas.levels import PagedLevelsResponse, LevelListItem
from db.models.user import User
from src.security.deps import get_current_user

router = APIRouter(prefix="/levels", tags=["levels"])

def list_levels_handler(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
) -> PagedLevelsResponse:
    offset = (page - 1) * page_size

    total = db.execute(select(func.count()).select_from(Level)).scalar_one()
    total_pages = max(1, math.ceil(total / page_size)) if total else 1

    avg_rating = func.avg(LevelRating.rating).label("avg_rating")

    stmt = (
        select(Level, avg_rating)
        .outerjoin(LevelRating, LevelRating.level_id == Level.id)
        .group_by(Level.id)
        .order_by(Level.title.asc())
        .offset(offset)
        .limit(page_size)
    )

    rows = db.execute(stmt).all()

    items: list[LevelListItem] = []
    for level, avg in rows:
        items.append(
            LevelListItem(
                id=level.id,
                title=level.title,
                story=level.story,
                rating=(round(float(avg), 2) if avg is not None else None),
            )
        )

    return PagedLevelsResponse(
        items=items,
        page=page,
        page_size=page_size,
        total=total,
        total_pages=total_pages,
    )