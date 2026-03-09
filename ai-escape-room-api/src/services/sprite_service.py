from __future__ import annotations

import base64
import io
import time
from typing import Tuple, Dict, Any

import numpy as np
from PIL import Image

from openai_client import get_openai_client
from src.models.sprite_style import SpriteStyle
from src.models.service_types import FoundObjectWithPath
from src.services.storage_service import upload_bytes

client = get_openai_client()

SPRITE_QUALITY = "low"
SPRITE_BACKGROUND = "transparent"
SPRITE_MODEL = "gpt-image-1-mini"


def extract_sprite_token_usage(response: Any) -> Dict[str, int]:
    """Extract token usage from OpenAI image generation response."""
    if hasattr(response, "usage") and response.usage:
        return {
            "total_tokens": getattr(response.usage, "total_tokens", 1),
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


def _to_named_file(image_bytes: bytes, file_name: str) -> io.BytesIO:
    file_like = io.BytesIO(image_bytes)
    file_like.name = file_name
    file_like.seek(0)
    return file_like


def generate_sprite(
    *,
    level_id: str,
    prompt: str,
    file_name: str,
    resolution: str,
) -> Tuple[bytes, Dict[str, int], float]:
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
    upload_bytes(level_id, f"sprites/{file_name}", trimmed_bytes, "image/png")

    usage = extract_sprite_token_usage(result)
    return trimmed_bytes, usage, minutes


def edit_sprite(
    *,
    level_id: str,
    source_image_bytes: bytes,
    source_image_name: str,
    prompt: str,
    file_name: str,
    resolution: str = "1024x1024",
) -> Tuple[bytes, Dict[str, int], float]:
    start = time.time()
    source_file = _to_named_file(source_image_bytes, source_image_name)
    result = client.images.edit(
        model=SPRITE_MODEL,
        image=source_file,
        prompt=prompt,
        size=resolution,
        background=SPRITE_BACKGROUND,
        quality=SPRITE_QUALITY,
    )
    elapsed = time.time() - start
    minutes = elapsed / 60.0

    image_base64 = result.data[0].b64_json
    edited_bytes = base64.b64decode(image_base64)
    upload_bytes(level_id, f"sprites/{file_name}", edited_bytes, "image/png")

    usage = extract_sprite_token_usage(result)
    return edited_bytes, usage, minutes


def generate_door_pair(level_id: str, prompt: str) -> Tuple[int, float]:
    closed_bytes, usage1, mins1 = generate_sprite(
        level_id=level_id,
        prompt=prompt,
        file_name="door_closed.png",
        resolution="1024x1536",
    )

    open_prompt = """
Using the provided image as the reference, keep the exact same door:
same materials, colors, panel pattern, handle, frame, lighting, and camera angle.
Change only one thing: the door is now open about 45 degrees inward.
Show a slight dark interior gap behind the door. Do not change background.
"""

    _, usage2, mins2 = edit_sprite(
        level_id=level_id,
        source_image_bytes=closed_bytes,
        source_image_name="door_closed.png",
        prompt=open_prompt,
        file_name="door_open.png",
        resolution="1024x1536",
    )

    total_tokens = usage1.get("total_tokens", 0) + usage2.get("total_tokens", 0)
    total_minutes = mins1 + mins2
    return total_tokens, total_minutes


def generate_ui_sprites(level_id: str, sprite_style: SpriteStyle = SpriteStyle.CARTOON) -> Tuple[int, float]:
    """Generate UI sprites and return total tokens and minutes used."""
    total_tokens = 0
    total_minutes = 0.0

    style_prompt = f"{sprite_style} style"

    _, tokens, mins = generate_sprite(
        level_id=level_id,
        prompt=f"A notepad, {style_prompt}",
        file_name="notepad.png",
        resolution="1024x1024",
    )
    total_tokens += tokens.get("total_tokens", 0)
    total_minutes += mins

    _, tokens, mins = generate_sprite(
        level_id=level_id,
        prompt=f"A backpack, {style_prompt}",
        file_name="inventory.png",
        resolution="1024x1024",
    )
    total_tokens += tokens.get("total_tokens", 0)
    total_minutes += mins

    _, tokens, mins = generate_sprite(
        level_id=level_id,
        prompt=f"A single detailed human eye, {style_prompt}",
        file_name="cursor_examine.png",
        resolution="1024x1024",
    )
    total_tokens += tokens.get("total_tokens", 0)
    total_minutes += mins

    _, tokens, mins = generate_sprite(
        level_id=level_id,
        prompt=f"A magnifying glass, {style_prompt}",
        file_name="cursor_search.png",
        resolution="1024x1024",
    )
    total_tokens += tokens.get("total_tokens", 0)
    total_minutes += mins

    _, tokens, mins = generate_sprite(
        level_id=level_id,
        prompt=f"A hand palm, {style_prompt}",
        file_name="cursor_use.png",
        resolution="1024x1024",
    )
    total_tokens += tokens.get("total_tokens", 0)
    total_minutes += mins

    _, tokens, mins = generate_sprite(
        level_id=level_id,
        prompt=f"A hand, doing a picking up gesture, {style_prompt}",
        file_name="cursor_take.png",
        resolution="1024x1024",
    )
    total_tokens += tokens.get("total_tokens", 0)
    total_minutes += mins

    return total_tokens, total_minutes


def generate_level_object_sprites(
    found_objects: list[FoundObjectWithPath],
    level_id: str,
    sprite_style: str = "Cartoon",
) -> Tuple[int, float]:
    """Generate level object sprites and return total tokens and minutes used."""
    total_tokens = 0
    total_minutes = 0.0

    for obj in found_objects:
        appellation = obj["object"]["inspectionData"]["appellation"]
        information = obj["object"]["inspectionData"]["information"]
        prompt = f"{sprite_style} Style, {appellation}, {information}"
        object_id = obj["object"]["id"]
        resolution = obj["object"]["spriteResolution"]

        if obj["is_exit"]:
            tokens, mins = generate_door_pair(level_id, prompt)
            total_tokens += tokens
            total_minutes += mins
        else:
            _, tokens, mins = generate_sprite(
                level_id=level_id,
                prompt=prompt,
                file_name=f"{object_id}.png",
                resolution=resolution,
            )
            total_tokens += tokens.get("total_tokens", 0)
            total_minutes += mins

    return total_tokens, total_minutes
