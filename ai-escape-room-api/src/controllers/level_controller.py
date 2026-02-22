from fastapi import HTTPException
from pathlib import Path
from src.services.level_service import generate_new_level, find_objects_with_id_and_inspection, create_level_with_id, update_level_successful_sprite_generation
from src.services.sprite_service import generate_ui_sprites, generate_level_object_sprites
from config import LEVELS_DIR
import json
from sqlalchemy.orm import Session
from sqlalchemy import select
from db.models.level_rating import LevelRating
from db.models.user import User
from src.schemas.level import RateLevelRequest

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
