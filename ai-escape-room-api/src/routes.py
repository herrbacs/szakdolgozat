from fastapi import APIRouter
from fastapi.responses import JSONResponse, FileResponse
from src.controllers.level_controller import generate_new_level_handler, get_level_object_sprite_handler, load_level_handler

router = APIRouter()

@router.get("/")
def hello_world():
    return {"message": "Hello World"}

@router.get("/sprites/{level_id}/{object_id}")
def serve_image(level_id: str, object_id: str):
    path = get_level_object_sprite_handler(level_id, object_id)
    return FileResponse(path)

@router.get("/generate-new-level")
def generate_level():
    return JSONResponse(content=generate_new_level_handler())

@router.get("/level/{level_id}")
def generate_level(level_id: str):
    return JSONResponse(load_level_handler(level_id))
