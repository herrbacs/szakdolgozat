from pathlib import Path
from config import LEVELS_DIR

LEVELS_DIR.mkdir(parents=True, exist_ok=True)

def ensure_and_get_level_dir(level_id: str) -> Path:
    path = LEVELS_DIR / level_id
    path.mkdir(parents=True, exist_ok=True)
    return path

def ensure_and_get_sprites_of_level_dir(level_id):
    path = ensure_and_get_level_dir(level_id) / "sprites"
    path.mkdir(parents=True, exist_ok=True)
    return path