from fastapi import APIRouter
from fastapi.responses import JSONResponse, FileResponse
from src.controllers.level_controller import generate_new_level_handler, get_level_object_sprite_handler, load_level_handler
from src.routes.auth_routes import router as auth_router
from src.routes.level_routes import router as level_router
from src.routes.levels_routes import router as levels_router

router = APIRouter()

router.include_router(auth_router)
router.include_router(level_router)
router.include_router(levels_router)

@router.get("/")
def hello_world():
    return {"message": "Hello World"}

@router.get("/sprites/{level_id}/{object_id}")
def serve_image(level_id: str, object_id: str):
    path = get_level_object_sprite_handler(level_id, object_id)
    return FileResponse(path)

