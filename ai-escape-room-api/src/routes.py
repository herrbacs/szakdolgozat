from fastapi import APIRouter
from fastapi.responses import JSONResponse, FileResponse
from pathlib import Path
from src.controllers.level_controller import generate_new_level_handler

router = APIRouter()

@router.get("/")
def hello_world():
    return {"message": "Hello World"}

# @router.get("/images/{filename}")
# def serve_image(filename: str):
#     file_path = SPRITES_DIR / filename
#     return FileResponse(file_path)

@router.get("/generate-level")
def generate_level():
    return JSONResponse(content=generate_new_level_handler())
