from ast import Tuple
import json
from fastapi import HTTPException, status
from pathlib import Path
from src.services.level_service import generate_new_level, find_objects_with_id_and_inspection, create_level_with_id, update_level_successful_sprite_generation
from src.services.sprite_service import generate_ui_sprites, generate_level_object_sprites
from config import LEVELS_DIR
from sqlalchemy.orm import Session
from db.models.level_rating import LevelRating
from db.models.user import User
from db.models.level import Level
from db.models.favorite_level import FavoriteLevel
from src.schemas.level import RateLevelRequest
from sqlalchemy import UUID, Select, select, func
from src.schemas.levels import LevelListItem, LevelListQuery
from src.schemas.pagination import PaginationQuery, PagedResponse
from src.services.pagination_service import paginate


def generate_new_level_handler(db: Session):
    success, level, level_id = generate_new_level()
    level_db_entity = create_level_with_id(
        db=db,
        level_id=level_id,
        success=success,
        story=level["story"] if success else "",
        title=level["title"] if success else "",
    )

    if (success is False):  
        raise HTTPException(
            status_code=500,
            detail={
                "message": "Nem sikerült végigjátszható pályát generálni.",
            },
        )

    level_objects = find_objects_with_id_and_inspection(level)
    generate_ui_sprites(level_id)
    generate_level_object_sprites(level_objects, level_id)
    update_level_successful_sprite_generation(db, level_db_entity)

    return level

def get_level_object_sprite_handler(level_id: str, object_id: str) -> Path:
    level_dir = LEVELS_DIR / level_id

    if not level_dir.exists() or not level_dir.is_dir():
        raise HTTPException(status_code=404, detail="Level not found")

    sprite_path = level_dir / "sprites" / f"{object_id}.png"
    if not sprite_path.exists() or not sprite_path.is_file():
        raise HTTPException(status_code=404, detail="Sprite not found")

    return sprite_path

def load_level_handler(level_id: str):
    level_dir = LEVELS_DIR / level_id
    
    if not level_dir.exists() or not level_dir.is_dir():
        raise HTTPException(status_code=404, detail="Level not found")

    file_path = level_dir / "final_level.json"
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Level file not found")

    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

def rate_level_handler(
    level_id: str,
    req: RateLevelRequest,
    db: Session,
    user: User
):
    rating = req.rate
    user_id = user.id
 
    if rating < 1 or rating > 5:
        raise ValueError("rating must be between 1 and 5")

    existing = db.execute(
        select(LevelRating).where(
            LevelRating.user_id == user_id,
            LevelRating.level_id == level_id
        )
    ).scalar_one_or_none()

    if existing is None:
        db.add(LevelRating(user_id=user_id, level_id=level_id, rating=rating))
    else:
        existing.rating = rating

    db.commit()

def add_to_favorite_handler(
    level_id: str,
    db: Session,
    user: User
):
    level = db.execute(
        select(Level).where(Level.id == level_id)
    ).scalar_one_or_none()

    if not level:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Level not found")

    existing = db.execute(
        select(FavoriteLevel).where(
            FavoriteLevel.user_id == user.id,
            FavoriteLevel.level_id == level_id,
        )
    ).scalar_one_or_none()

    if existing:
        return

    fav = FavoriteLevel(
        user_id=user.id,
        level_id=level_id,
    )

    db.add(fav)
    db.commit()

def remove_from_favorite_handler(
    level_id: str,
    db: Session,
    user: User
):
    existing = db.execute(
        select(FavoriteLevel).where(
            FavoriteLevel.user_id == user.id,
            FavoriteLevel.level_id == level_id,
        )
    ).scalar_one_or_none()

    if not existing:
        return

    db.delete(existing)
    db.commit()

def list_levels_handler(
    pagination: PaginationQuery,
    db: Session,
    query: LevelListQuery,
) -> PagedResponse[LevelListItem]:
    avg_rating = func.avg(LevelRating.rating).label("avg_rating")

    def apply_filters(stmt: Select) -> Select:
        if query.title:
            stmt = stmt.where(Level.title.ilike(f"%{query.title.strip()}%"))
        if query.story:
            stmt = stmt.where(Level.story.ilike(f"%{query.story.strip()}%"))
        if query.rating_gte is not None:
            stmt = stmt.having(avg_rating >= query.rating_gte)
        return stmt

    base_stmt = (
        select(Level.id)
        .outerjoin(LevelRating, LevelRating.level_id == Level.id)
        .group_by(Level.id)
    )
    base_stmt = apply_filters(base_stmt)
    count_stmt = select(func.count()).select_from(base_stmt.subquery())

    data_stmt = (
        select(Level, avg_rating)
        .outerjoin(LevelRating, LevelRating.level_id == Level.id)
        .group_by(Level.id)
    )
    data_stmt = apply_filters(data_stmt).order_by(Level.title.asc())

    def map_row(row) -> LevelListItem:
        level, avg = row
        return LevelListItem(
            id=level.id,
            title=level.title,
            story=level.story,
            generated_at=level.created_at,
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
            generated_at=level.created_at,
            rating=(round(float(avg), 2) if avg is not None else None),
        )

    return paginate(
        db=db,
        pagination=pagination,
        data_stmt=data_stmt,
        count_stmt=count_stmt,
        map_row=map_row,
    )
