from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from db.connection import get_db
from sqlalchemy.orm import Session
from src.controllers.level_controller import generate_new_level_handler, load_level_handler, rate_level_handler
from src.security.deps import get_current_user
from db.models.user import User
from src.schemas.level import RateLevelRequest

router = APIRouter(prefix="/level", tags=["level"])

@router.post("/generate")
def generate_level(db: Session = Depends(get_db)):
    return JSONResponse(content=generate_new_level_handler(db))

@router.get("/load/{level_id}")
def load_level(level_id: str):
    return JSONResponse(load_level_handler(level_id))

@router.post("/rate/{level_id}")
def rate_level(
    level_id: str,
    req: RateLevelRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
): rate_level_handler(level_id, req, db, user)