from fastapi import APIRouter
from fastapi.responses import JSONResponse
from src.controllers.level_controller import generate_new_level_handler, load_level_handler

router = APIRouter(prefix="/level", tags=["level"])

@router.get("/generate-new-level")
def generate_level():
    return JSONResponse(content=generate_new_level_handler())

@router.get("/level/{level_id}")
def generate_level(level_id: str):
    return JSONResponse(load_level_handler(level_id))