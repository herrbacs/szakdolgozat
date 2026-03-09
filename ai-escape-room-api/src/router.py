from fastapi import APIRouter
from fastapi.responses import Response
from src.controllers.levels_controller import get_level_object_sprite_handler
from src.routes.auth_routes import router as auth_router
from src.routes.levels_routes import router as levels_router
from src.routes.token_routes import router as tokens_router
from src.routes.users_routes import router as users_router

router = APIRouter()

router.include_router(auth_router)
router.include_router(tokens_router)
router.include_router(users_router)
router.include_router(levels_router)

@router.get("/")
def hello_world() -> dict[str, str]:
    return {"message": "Hello World"}

@router.get("/sprites/{level_id}/{object_id}")
def serve_sprite(level_id: str, object_id: str) -> Response:
    sprite = get_level_object_sprite_handler(level_id, object_id)
    return Response(content=sprite, media_type="image/png")

