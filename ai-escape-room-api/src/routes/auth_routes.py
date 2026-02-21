from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.connection import get_db
from src.schemas.auth import RegisterRequest, LoginRequest, AuthResult
from src.controllers.auth_controller import login_handler, register_handler

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=AuthResult)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    return register_handler(req, db)

@router.post("/login", response_model=AuthResult)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    return login_handler(req, db)