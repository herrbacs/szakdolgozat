from fastapi import APIRouter
from fastapi.responses import Response
from src.controllers.levels_controller import get_level_object_sprite_handler


router = APIRouter(prefix="/sprites", tags=["sprites"])

@router.get("/{level_id}/{object_id}")
def serve_sprite(level_id: str, object_id: str) -> Response:
    sprite = get_level_object_sprite_handler(level_id, object_id)
    return Response(content=sprite, media_type="image/png")
