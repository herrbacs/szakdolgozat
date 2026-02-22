from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import select, func
import math
from db.connection import get_db
from db.models.level import Level
from db.models.level_rating import LevelRating
from src.schemas.levels import LevelListItem
from src.schemas.pagination import PaginationQuery, PagedResponse
from src.services.pagination_service import paginate

def list_levels_handler(
    pagination: PaginationQuery,
    db: Session
) -> PagedResponse[LevelListItem]:
    avg_rating = func.avg(LevelRating.rating).label("avg_rating")

    data_stmt = (
        select(Level, avg_rating)
        .outerjoin(LevelRating, LevelRating.level_id == Level.id)
        .group_by(Level.id)
        .order_by(Level.title.asc())
    )

    count_stmt = select(func.count()).select_from(Level)

    def map_row(row) -> LevelListItem:
        level, avg = row
        return LevelListItem(
            id=level.id,
            title=level.title,
            story=level.story,
            rating=(round(float(avg), 2) if avg is not None else None),
        )

    return paginate(
        db=db,
        pagination=pagination,
        data_stmt=data_stmt,
        count_stmt=count_stmt,
        map_row=map_row,
    )