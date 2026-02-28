from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.connection import get_db
from src.schemas.auth import RegisterRequest, LoginRequest, LoginResponse, RefreshResponse, RefreshRequest
from src.controllers.auth_controller import login_handler, register_handler, refresh_token_handler
from db.models.user import User
from src.security.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    return register_handler(req, db)

@router.post("/login", response_model=LoginResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    return login_handler(req, db)

@router.post("/refresh-token", response_model=RefreshResponse)
def login(req: RefreshRequest, db: Session = Depends(get_db)):
    return refresh_token_handler(req, db)

@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return {"id": user.id, "email": user.email, "username": user.username}