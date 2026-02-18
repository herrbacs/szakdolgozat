from fastapi import APIRouter
from fastapi.responses import JSONResponse, FileResponse
from src.controllers.level_controller import generate_new_level_handler, get_level_object_sprite_handler

router = APIRouter()

@router.get("/")
def hello_world():
    return {"message": "Hello World"}

@router.get("/sprites/{level_id}/{object_id}")
def serve_image(level_id: str, object_id: str):
    return FileResponse(get_level_object_sprite_handler(level_id, object_id))

@router.get("/generate-new-level")
def generate_level():
    return JSONResponse(content=generate_new_level_handler())
