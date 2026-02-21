from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from src.controllers.level_controller import generate_new_level_handler, load_level_handler
from db.connection import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/level", tags=["level"])

@router.post("/generate")
def generate_level(db: Session = Depends(get_db)):
    return JSONResponse(content=generate_new_level_handler(db))

@router.get("/level/{level_id}")
def generate_level(level_id: str):
    return JSONResponse(load_level_handler(level_id))