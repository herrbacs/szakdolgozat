import json
import uuid
from typing import Any
from fastapi import HTTPException, status
from pathlib import Path
from src.services.level_service import (
    generate_new_level,
    find_objects_with_id_and_inspection,
    create_level_with_id,
    update_level_successful_sprite_generation,
    get_average_tokens_for_difficulty,
)
from src.services.sprite_service import generate_ui_sprites, generate_level_object_sprites
from config import LEVELS_DIR
from sqlalchemy.orm import Session, aliased
from db.models.level_rating import LevelRating
from db.models.user import User
from db.models.level import Level
from db.models.favorite_level import FavoriteLevel
from db.models.level_token_usage import LevelTokenUsage, UsageType
from db.models.level_completion import LevelCompletion
from db.models.user_tokens import UserTokens
from src.schemas.level import RateLevelRequest, GenerateLevelRequest
from sqlalchemy import Select, select, func, case
from src.schemas.levels import LevelListItem, LevelListQuery, LevelCompletionRequest
from src.schemas.pagination import PaginationQuery, PagedResponse
from src.services.pagination_service import paginate
from src.models.service_types import LevelGenerationResult, TokenEstimate


def generate_new_level_handler(req: GenerateLevelRequest, db: Session, user: User) -> dict[str, Any]:
    estimate: TokenEstimate = get_average_tokens_for_difficulty(db, req.difficulty)
    estimated_tokens = estimate["tokens"]
    estimated_minutes = estimate["minutes"]

    user_tokens = db.execute(
        select(UserTokens).where(UserTokens.user_id == user.id)
    ).scalar_one_or_none()
    
    if user_tokens.balance < estimated_tokens:
        raise HTTPException(
            status_code=402,
            detail={
                "message": "Nincs elég token a pálya generáláshoz.",
                "required_tokens": estimated_tokens,
                "required_minutes": estimated_minutes,
                "current_balance": user_tokens.balance,
            },
        )
    
    result: LevelGenerationResult = generate_new_level(req.difficulty, req.sprite_style, req.story)
    success = result["success"]
    level = result["level"]
    level_id = result["level_id"]
    tokens = result["tokens"]
    
    persisted_level_id = level_id if level_id is not None else str(uuid.uuid4())

    level_db_entity = create_level_with_id(
        db=db,
        level_id=persisted_level_id,
        success=success,
        story=level["story"] if success else "",
        title=level["title"] if success else "",
        difficulty=req.difficulty,
        sprite_style=req.sprite_style
    )

    if success is False:  
        raise HTTPException(
            status_code=500,
            detail={
                "message": "Nem sikerült végigjátszható pályát generálni.",
            },
        )

    level_objects = find_objects_with_id_and_inspection(level)
    if level_id is None:
        raise HTTPException(status_code=500, detail={"message": "Generated level id is missing."})

    ui_sprite_tokens, ui_sprite_minutes = generate_ui_sprites(level_id, req.sprite_style)
    object_sprite_tokens, object_sprite_minutes = generate_level_object_sprites(level_objects, level_id, req.sprite_style)
    
    tokens["sprite_tokens"] = ui_sprite_tokens + object_sprite_tokens
    tokens["sprite_minutes"] = ui_sprite_minutes + object_sprite_minutes
    tokens["total_tokens"] += tokens["sprite_tokens"]
    tokens["total_minutes"] = tokens.get("total_minutes", 0.0) + tokens["sprite_minutes"]
    
    update_level_successful_sprite_generation(db, level_db_entity)
    
    # insert one row per usage type
    entries = []
    entries.append(LevelTokenUsage(
        level_id=level_id,
        usage_type=UsageType.GENERATION.value,
        tokens=tokens.get("generation_tokens", 0),
        minutes=tokens.get("generation_minutes", 0.0),
    ))
    entries.append(LevelTokenUsage(
        level_id=level_id,
        usage_type=UsageType.VALIDATION.value,
        tokens=tokens.get("validation_tokens", 0),
        minutes=tokens.get("validation_minutes", 0.0),
    ))
    # repair entry (may be zero if no repairs happened)
    entries.append(LevelTokenUsage(
        level_id=level_id,
        usage_type=UsageType.REPAIR.value,
        tokens=tokens.get("repair_tokens", 0),
        minutes=tokens.get("repair_minutes", 0.0),
    ))
    # sprite entry
    entries.append(LevelTokenUsage(
        level_id=level_id,
        usage_type=UsageType.SPRITE.value,
        tokens=tokens.get("sprite_tokens", 0),
        minutes=tokens.get("sprite_minutes", 0.0),
    ))
    db.add_all(entries)
    
    user_tokens = db.execute(
        select(UserTokens).where(UserTokens.user_id == user.id)
    ).scalar_one_or_none()
    
    user_tokens.balance -= tokens["total_tokens"]
    db.commit()
    
    # return generated level along with usage stats so client can display them
    return {"level": level, "tokens": tokens}

def get_level_object_sprite_handler(level_id: str, object_id: str) -> Path:
    level_dir = LEVELS_DIR / level_id

    if not level_dir.exists() or not level_dir.is_dir():
        raise HTTPException(status_code=404, detail="Level not found")

    sprite_path = level_dir / "sprites" / f"{object_id}.png"
    if not sprite_path.exists() or not sprite_path.is_file():
        raise HTTPException(status_code=404, detail="Sprite not found")

    return sprite_path

def load_level_handler(level_id: str) -> dict[str, Any]:
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
) -> None:
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
) -> None:
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
) -> None:
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

def get_user_level_rating_handler(
    level_id: str,
    db: Session,
    user: User
) -> dict[str, int | None]:
    rating = db.execute(
        select(LevelRating).where(
            LevelRating.user_id == user.id,
            LevelRating.level_id == level_id
        )
    ).scalar_one_or_none()

    return {"rating": rating.rating if rating else None}

def get_level_favorite_status_handler(
    level_id: str,
    db: Session,
    user: User
) -> dict[str, bool]:
    favorite = db.execute(
        select(FavoriteLevel).where(
            FavoriteLevel.user_id == user.id,
            FavoriteLevel.level_id == level_id,
        )
    ).scalar_one_or_none()

    return {"is_favorite": favorite is not None}


def record_level_completion_handler(
    level_id: str,
    req: LevelCompletionRequest,
    db: Session,
    user: User,
) -> dict[str, bool]:
    level = db.execute(
        select(Level).where(
            Level.id == level_id,
            Level.sucessfull_level_generation == True,
        )
    ).scalar_one_or_none()

    if not level:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Level not found")

    existing_completion = db.execute(
        select(LevelCompletion).where(
            LevelCompletion.user_id == user.id,
            LevelCompletion.level_id == level_id,
        )
    ).scalar_one_or_none()

    if existing_completion:
        return {"saved": False}

    db.add(
        LevelCompletion(
            user_id=user.id,
            level_id=level_id,
            completion_minutes=req.completion_minutes,
        )
    )
    db.commit()
    return {"saved": True}

def list_levels_handler(
    pagination: PaginationQuery,
    db: Session,
    query: LevelListQuery,
    user: User,
) -> PagedResponse[LevelListItem]:
    avg_rating = func.avg(LevelRating.rating).label("avg_rating")
    favorite_count = func.count(func.distinct(FavoriteLevel.user_id)).label("favorite_count")

    def apply_filters(stmt: Select) -> Select:
        stmt = stmt.where(Level.sucessfull_level_generation == True)
        if query.title:
            stmt = stmt.where(Level.title.ilike(f"%{query.title.strip()}%"))
        if query.story:
            stmt = stmt.where(Level.story.ilike(f"%{query.story.strip()}%"))
        if query.difficulty is not None:
            stmt = stmt.where(Level.difficulty == query.difficulty)
        if query.favorites_only:
            favorite_filter = aliased(FavoriteLevel)
            stmt = stmt.where(
                select(favorite_filter.id)
                .where(favorite_filter.level_id == Level.id, favorite_filter.user_id == user.id)
                .exists()
            )
        if query.rating_gte is not None:
            stmt = stmt.having(avg_rating >= query.rating_gte)
        return stmt

    # pre-aggregate usage per level so we can return totals/minutes/repair count
    usage_subq = (
        select(
            LevelTokenUsage.level_id.label("level_id"),
            func.sum(LevelTokenUsage.tokens).label("sum_tokens"),
            func.sum(LevelTokenUsage.minutes).label("sum_minutes"),
            # repair_count uses case with positional tuple per SQLAlchemy 2.0
            func.sum(case((LevelTokenUsage.usage_type == UsageType.REPAIR.value, 1), else_=0)).label("repair_count"),
        )
        .group_by(LevelTokenUsage.level_id)
        .subquery()
    )

    completion_subq = (
        select(
            LevelCompletion.level_id.label("level_id"),
            func.avg(LevelCompletion.completion_minutes).label("avg_completion_minutes"),
        )
        .group_by(LevelCompletion.level_id)
        .subquery()
    )

    base_stmt = (
        select(Level.id)
        .outerjoin(LevelRating, LevelRating.level_id == Level.id)
        .group_by(Level.id)
    )
    base_stmt = apply_filters(base_stmt)
    count_stmt = select(func.count()).select_from(base_stmt.subquery())

    data_stmt = (
        select(
            Level,
            avg_rating,
            favorite_count,
            usage_subq.c.sum_tokens,
            usage_subq.c.sum_minutes,
            usage_subq.c.repair_count,
            completion_subq.c.avg_completion_minutes,
        )
        .outerjoin(LevelRating, LevelRating.level_id == Level.id)
        .outerjoin(FavoriteLevel, FavoriteLevel.level_id == Level.id)
        .outerjoin(usage_subq, usage_subq.c.level_id == Level.id)
        .outerjoin(completion_subq, completion_subq.c.level_id == Level.id)
        .group_by(
            Level.id,
            usage_subq.c.sum_tokens,
            usage_subq.c.sum_minutes,
            usage_subq.c.repair_count,
            completion_subq.c.avg_completion_minutes,
        )
    )
    data_stmt = apply_filters(data_stmt).order_by(Level.title.asc())

    def map_row(row: Any) -> LevelListItem:
        level, avg, favorites, total_tokens, total_minutes, repair_count, avg_completion_minutes = row
        return LevelListItem(
            id=level.id,
            title=level.title,
            story=level.story,
            difficulty=level.difficulty,
            generated_at=level.created_at,
            rating=(round(float(avg), 2) if avg is not None else None),
            favorite_count=int(favorites or 0),
            total_tokens=int(total_tokens or 0),
            total_minutes=float(total_minutes or 0.0),
            repair_count=int(repair_count or 0),
            avg_completion_minutes=(round(float(avg_completion_minutes), 2) if avg_completion_minutes is not None else None),
        )

    return paginate(
        db=db,
        pagination=pagination,
        data_stmt=data_stmt,
        count_stmt=count_stmt,
        map_row=map_row,
    )
