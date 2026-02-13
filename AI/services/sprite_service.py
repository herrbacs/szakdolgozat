from pathlib import Path
import base64
from openai_client import get_openai_client

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

    sprite_dir = out_dir / "sprites"
    sprite_dir.mkdir(parents=True, exist_ok=True)

    file_path = sprite_dir / file_name
    file_path.write_bytes(image_bytes)

    return file_path  # <-- teljes útvonal


def edit_sprite(
    *,
    out_dir: Path,
    source_image_path: Path,
    prompt: str,
    file_name: str,
    resolution: str = "1024x1024",
) -> Path:
    sprite_dir = out_dir / "sprites"
    sprite_dir.mkdir(parents=True, exist_ok=True)

    out_path = sprite_dir / file_name

    # Biztos ami biztos, itt egy gyors ellenőrzés:
    if not source_image_path.exists():
        raise FileNotFoundError(f"Source image not found: {source_image_path}")

    # FONTOS: image=img_file és a hívás a with blokkon belül!
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


def generate_door_pair(*, out_dir: Path) -> tuple[Path, Path]:
    door_style = """
Cartoon style, vector art look, clean outlines, flat shading.
Same camera angle, centered, full door visible, neutral background.
Door details: wooden door with vertical panels, brass handle on the right,
small peephole centered above handle, white door frame.
"""

    closed_prompt = f"""
{door_style}
A closed door, fully shut.
"""

    closed_path = generate_sprite(
        out_dir=out_dir,
        prompt=closed_prompt,
        file_name="door_closed.png",
        resolution="1024x1536",
    )

    open_prompt = f"""
Using the provided image as the reference, keep the exact same door:
same materials, colors, panel pattern, handle, frame, lighting, and camera angle.
Change only one thing: the door is now open about 45 degrees inward.
Show a slight dark interior gap behind the door. Do not change background.
{door_style}
"""

    open_path = edit_sprite(
        out_dir=out_dir,
        source_image_path=closed_path,
        prompt=open_prompt,
        file_name="door_open.png",
        resolution="1024x1536",
    )

    return closed_path, open_path


def generate_ui_sprites(*, out_dir: Path):
    generate_sprite(
        out_dir=out_dir,
        prompt="A notepad, Cartoon style, Vector Art",
        file_name="notepad.png",
        resolution="1024x1024",
    )
    generate_sprite(
        out_dir=out_dir,
        prompt="A backpack, Cartoon style, Vector Art",
        file_name="inventory.png",
        resolution="1024x1024",
    )
    generate_sprite(
        out_dir=out_dir,
        prompt="A single detailed human eye, Cartoon style, Vector Art",
        file_name="cursor_examine.png",
        resolution="1024x1024",
    )
    generate_sprite(
        out_dir=out_dir,
        prompt="A magnifying glass, Cartoon style, Vector Art",
        file_name="cursor_search.png",
        resolution="1024x1024",
    )
    generate_sprite(
        out_dir=out_dir,
        prompt="A hand palm, Cartoon style, Vector Art",
        file_name="cursor_use.png",
        resolution="1024x1024",
    )
    generate_sprite(
        out_dir=out_dir,
        prompt="A hand, doing a picking up gesture, Cartoon style, Vector Art",
        file_name="cursor_take.png",
        resolution="1024x1024",
    )

    generate_door_pair(out_dir=out_dir)
