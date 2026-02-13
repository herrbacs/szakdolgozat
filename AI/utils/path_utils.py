from pathlib import Path
from config import LEVELS_DIR

def level_dir(level_id: str) -> Path:
    d = LEVELS_DIR / level_id
    d.mkdir(parents=True, exist_ok=True)
    return d
