# services/sprite_service.py
import base64
from openai_client import get_openai_client

client = get_openai_client()

def generate_sprite(
    *,
    prompt: str,
    out_path: str = "sprite.png",
    model: str = "gpt-image-1-mini",
    size: str = "1024x1024",
    background: str = "transparent",
    quality: str = "low",
) -> str:
    result = client.images.generate(
        model=model,
        prompt=prompt,
        size=size,
        background=background,
        quality=quality,
    )

    image_base64 = result.data[0].b64_json
    image_bytes = base64.b64decode(image_base64)

    with open(out_path, "wb") as f:
        f.write(image_bytes)

    return out_path
