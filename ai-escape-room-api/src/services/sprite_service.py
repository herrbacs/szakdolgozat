from PIL import Image
import numpy as np
import base64
import io
import time
from pathlib import Path
from typing import Tuple, Dict, Any
from PIL import Image
from openai_client import get_openai_client
from src.utils.path_utils import ensure_and_get_sprites_of_level_dir
from src.schemas.level import SpriteStyle

client = get_openai_client()

SPRITE_QUALITY = "low"
SPRITE_BACKGROUND = "transparent"
SPRITE_MODEL = "gpt-image-1-mini"

def extract_sprite_token_usage(response: Any) -> Dict[str, int]:
    """Extract token usage from OpenAI image generation response."""
    if hasattr(response, 'usage') and response.usage:
        return {
            "total_tokens": getattr(response.usage, 'total_tokens', 1),
        }
    return {"total_tokens": 1}

def trim_transparent_bytes(image_bytes: bytes) -> bytes:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    data = np.array(img)

    alpha = data[:, :, 3]
    mask = alpha > 5
    coords = np.argwhere(mask)

    if coords.size == 0:
        return image_bytes

    y0, x0 = coords.min(axis=0)
    y1, x1 = coords.max(axis=0) + 1

    cropped = img.crop((x0, y0, x1, y1))

    output = io.BytesIO()
    cropped.save(output, format="PNG")
    return output.getvalue()


def generate_sprite(
    *,
    out_dir: Path,
    prompt: str,
    file_name: str,
    resolution: str,
) -> Tuple[Path, Dict[str, int], float]:
    start = time.time()
    result = client.images.generate(
        prompt=prompt,
        size=resolution,
        model=SPRITE_MODEL,
        background=SPRITE_BACKGROUND,
        quality=SPRITE_QUALITY,
    )
    elapsed = time.time() - start
    minutes = elapsed / 60.0

    image_base64 = result.data[0].b64_json
    image_bytes = base64.b64decode(image_base64)

    trimmed_bytes = trim_transparent_bytes(image_bytes)
    file_path = out_dir / file_name
    file_path.write_bytes(trimmed_bytes)

    usage = extract_sprite_token_usage(result)
    return file_path, usage, minutes


def edit_sprite(
    *,
    out_dir: Path,
    source_image_path: Path,
    prompt: str,
    file_name: str,
    resolution: str = "1024x1024",
) -> Tuple[Path, Dict[str, int], float]:
    out_path = out_dir / file_name
    if not source_image_path.exists():
        raise FileNotFoundError(f"Source image not found: {source_image_path}")

    start = time.time()
    with open(source_image_path, "rb") as img_file:
        result = client.images.edit(
            model=SPRITE_MODEL,
            image=img_file,
            prompt=prompt,
            size=resolution,
            background=SPRITE_BACKGROUND,
            quality=SPRITE_QUALITY,
        )
    elapsed = time.time() - start
    minutes = elapsed / 60.0

    image_base64 = result.data[0].b64_json
    out_path.write_bytes(base64.b64decode(image_base64))

    usage = extract_sprite_token_usage(result)
    return out_path, usage, minutes


def generate_door_pair(out_dir: Path, prompt) -> Tuple[Tuple[Path, Path], int, float]:
    closed_path, usage1, mins1 = generate_sprite(
        out_dir=out_dir,
        prompt=prompt,
        file_name="door_closed.png",
        resolution="1024x1536",
    )

    open_prompt = f"""
Using the provided image as the reference, keep the exact same door:
same materials, colors, panel pattern, handle, frame, lighting, and camera angle.
Change only one thing: the door is now open about 45 degrees inward.
Show a slight dark interior gap behind the door. Do not change background.
"""

    open_path, usage2, mins2 = edit_sprite(
        out_dir=out_dir,
        source_image_path=closed_path,
        prompt=open_prompt,
        file_name="door_open.png",
        resolution="1024x1536",
    )

    total_tokens = usage1.get("total_tokens", 0) + usage2.get("total_tokens", 0)
    total_minutes = mins1 + mins2
    return (closed_path, open_path), total_tokens, total_minutes


def generate_ui_sprites(level_id: str, sprite_style: SpriteStyle = SpriteStyle.CARTOON) -> Tuple[int, float]:
    """Generate UI sprites and return total tokens and minutes used."""
    sprite_dir = ensure_and_get_sprites_of_level_dir(level_id)
    total_tokens = 0
    total_minutes = 0.0
    
    style_prompt = f"{sprite_style} style"
    
    _, tokens, mins = generate_sprite(
        out_dir=sprite_dir,
        prompt=f"A notepad, {style_prompt}",
        file_name="notepad.png",
        resolution="1024x1024",
    )
    total_tokens += tokens.get("total_tokens", 0)
    total_minutes += mins
    
    _, tokens, mins = generate_sprite(
        out_dir=sprite_dir,
        prompt=f"A backpack, {style_prompt}",
        file_name="inventory.png",
        resolution="1024x1024",
    )
    total_tokens += tokens.get("total_tokens", 0)
    total_minutes += mins
    
    _, tokens, mins = generate_sprite(
        out_dir=sprite_dir,
        prompt=f"A single detailed human eye, {style_prompt}",
        file_name="cursor_examine.png",
        resolution="1024x1024",
    )
    total_tokens += tokens.get("total_tokens", 0)
    total_minutes += mins
    
    _, tokens, mins = generate_sprite(
        out_dir=sprite_dir,
        prompt=f"A magnifying glass, {style_prompt}",
        file_name="cursor_search.png",
        resolution="1024x1024",
    )
    total_tokens += tokens.get("total_tokens", 0)
    total_minutes += mins
    
    _, tokens, mins = generate_sprite(
        out_dir=sprite_dir,
        prompt=f"A hand palm, {style_prompt}",
        file_name="cursor_use.png",
        resolution="1024x1024",
    )
    total_tokens += tokens.get("total_tokens", 0)
    total_minutes += mins
    
    _, tokens, mins = generate_sprite(
        out_dir=sprite_dir,
        prompt=f"A hand, doing a picking up gesture, {style_prompt}",
        file_name="cursor_take.png",
        resolution="1024x1024",
    )
    total_tokens += tokens.get("total_tokens", 0)
    total_minutes += mins
    
    return total_tokens, total_minutes

def generate_level_object_sprites(found_objects: list[dict], level_id: str, sprite_style: str = "Cartoon") -> Tuple[int, float]:
    """Generate level object sprites and return total tokens and minutes used."""
    sprite_dir = ensure_and_get_sprites_of_level_dir(level_id)
    total_tokens = 0
    total_minutes = 0.0
    
    for obj in found_objects:
        appellation = obj["object"]["inspectionData"]["appellation"]
        information = obj["object"]["inspectionData"]["information"]
        prompt=f'{sprite_style} Style, {appellation}, {information}'
        id = obj["object"]["id"]
        resolution = obj["object"]["spriteResolution"]

        if obj["is_exit"]:
            (_, _), tokens, mins = generate_door_pair(sprite_dir, prompt)
            total_tokens += tokens
            total_minutes += mins
        else:
            _, tokens, mins = generate_sprite(
                out_dir=sprite_dir,
                prompt=prompt,
                file_name=f'{id}.png',
                resolution=resolution,
            )
            total_tokens += tokens.get("total_tokens", 0)
            total_minutes += mins
    
    return total_tokens, total_minutes
