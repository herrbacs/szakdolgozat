from pathlib import Path
import base64
from openai_client import get_openai_client
from src.utils.path_utils import ensure_and_get_sprites_of_level_dir

client = get_openai_client()

SPRITE_QUALITY = "low"
SPRITE_BACKGROUND = "transparent"
SPRITE_MODEL = "gpt-image-1-mini"


def generate_sprite(
    *,
    out_dir: Path,
    prompt: str,
    file_name: str,
    resolution: str,
) -> Path:
    result = client.images.generate(
        prompt=prompt,
        size=resolution,
        model=SPRITE_MODEL,
        background=SPRITE_BACKGROUND,
        quality=SPRITE_QUALITY,
    )

    image_base64 = result.data[0].b64_json
    image_bytes = base64.b64decode(image_base64)

    file_path = out_dir / file_name
    file_path.write_bytes(image_bytes)

    return file_path


def edit_sprite(
    *,
    out_dir: Path,
    source_image_path: Path,
    prompt: str,
    file_name: str,
    resolution: str = "1024x1024",
) -> Path:
    out_path = out_dir / file_name
    if not source_image_path.exists():
        raise FileNotFoundError(f"Source image not found: {source_image_path}")

    with open(source_image_path, "rb") as img_file:
        result = client.images.edit(
            model=SPRITE_MODEL,
            image=img_file,
            prompt=prompt,
            size=resolution,
            background=SPRITE_BACKGROUND,
            quality=SPRITE_QUALITY,
        )

    image_base64 = result.data[0].b64_json
    out_path.write_bytes(base64.b64decode(image_base64))

    return out_path


def generate_door_pair(out_dir: Path, prompt) -> tuple[Path, Path]:
    closed_path = generate_sprite(
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

    open_path = edit_sprite(
        out_dir=out_dir,
        source_image_path=closed_path,
        prompt=open_prompt,
        file_name="door_open.png",
        resolution="1024x1536",
    )

    return closed_path, open_path


def generate_ui_sprites(level_id: str):
    sprite_dir = ensure_and_get_sprites_of_level_dir(level_id)
    generate_sprite(
        out_dir=sprite_dir,
        prompt="A notepad, Cartoon style, Vector Art",
        file_name="notepad.png",
        resolution="1024x1024",
    )
    generate_sprite(
        out_dir=sprite_dir,
        prompt="A backpack, Cartoon style, Vector Art",
        file_name="inventory.png",
        resolution="1024x1024",
    )
    generate_sprite(
        out_dir=sprite_dir,
        prompt="A single detailed human eye, Cartoon style, Vector Art",
        file_name="cursor_examine.png",
        resolution="1024x1024",
    )
    generate_sprite(
        out_dir=sprite_dir,
        prompt="A magnifying glass, Cartoon style, Vector Art",
        file_name="cursor_search.png",
        resolution="1024x1024",
    )
    generate_sprite(
        out_dir=sprite_dir,
        prompt="A hand palm, Cartoon style, Vector Art",
        file_name="cursor_use.png",
        resolution="1024x1024",
    )
    generate_sprite(
        out_dir=sprite_dir,
        prompt="A hand, doing a picking up gesture, Cartoon style, Vector Art",
        file_name="cursor_take.png",
        resolution="1024x1024",
    )

def generate_level_object_sprites(found_objects: list[dict], level_id: str):
    sprite_dir = ensure_and_get_sprites_of_level_dir(level_id)
    for obj in found_objects:
        appellation = obj["object"]["inspectionData"]["appellation"]
        information = obj["object"]["inspectionData"]["information"]
        prompt=f'Cartoon Style, {appellation}, {information}'
        id = obj["object"]["id"]
        resolution = obj["object"]["spriteResolution"]

        if obj["is_exit"]:
            generate_door_pair(sprite_dir, prompt)
        else:
            generate_sprite(
                out_dir=sprite_dir,
                prompt=prompt,
                file_name=f'{id}.png',
                resolution=resolution,
            )
