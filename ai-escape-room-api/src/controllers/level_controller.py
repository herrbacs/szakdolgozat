from fastapi import HTTPException
from pathlib import Path
from src.services.level_service import generate_new_level, find_objects_with_id_and_inspection
from src.services.sprite_service import generate_ui_sprites, generate_level_object_sprites
from config import LEVELS_DIR

def generate_new_level_handler():
    level, level_id = generate_new_level()
    level_objects = find_objects_with_id_and_inspection(level)
    generate_ui_sprites(level_id)
    generate_level_object_sprites(level_objects, level_id)

    return level

def get_level_object_sprite_handler(level_id: str, object_id: str) -> Path:
    level_dir = LEVELS_DIR / level_id

    if not level_dir.exists() or not level_dir.is_dir():
        raise HTTPException(status_code=404, detail="Folder not found")

    sprite_path = level_dir / "sprites" / f"{object_id}.png"
    if not sprite_path.exists() or not sprite_path.is_file():
        raise HTTPException(status_code=404, detail="File not found")

    return sprite_path
