from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.connection import get_db
from src.schemas.auth import RegisterRequest, LoginRequest, LoginResponse, RefreshResponse, RefreshRequest
from src.controllers.auth_controller import login_handler, register_handler, refresh_token_handler
from typing import Any

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)) -> Any:
    return register_handler(req, db)

@router.post("/login", response_model=LoginResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)) -> LoginResponse:
    return login_handler(req, db)

@router.post("/refresh-token", response_model=RefreshResponse)
def refresh_token(req: RefreshRequest, db: Session = Depends(get_db)) -> dict[str, Any]:
    return refresh_token_handler(req, db)
