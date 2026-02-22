from sqlalchemy.orm import Session
from sqlalchemy import select, func
from db.models.level import Level
from db.models.level_rating import LevelRating
from src.schemas.levels import LevelListItem
from src.schemas.pagination import PaginationQuery, PagedResponse
from src.services.pagination_service import paginate
from db.models.user import User
from db.models.favorite_level import FavoriteLevel

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

def list_favorites_handler(
    pagination: PaginationQuery,
    db: Session,
    user: User,
) -> PagedResponse[LevelListItem]:
    avg_rating = func.avg(LevelRating.rating).label("avg_rating")

    data_stmt = (
        select(Level, avg_rating)
        .join(FavoriteLevel, FavoriteLevel.level_id == Level.id)
        .outerjoin(LevelRating, LevelRating.level_id == Level.id)
        .where(FavoriteLevel.user_id == user.id)
        .group_by(Level.id)
        .order_by(Level.title.asc())
    )

    count_stmt = (
        select(func.count())
        .select_from(FavoriteLevel)
        .where(FavoriteLevel.user_id == user.id)
    )

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