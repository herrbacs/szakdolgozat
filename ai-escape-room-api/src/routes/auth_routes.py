from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.connection import get_db
from src.schemas.auth import RegisterRequest, LoginRequest, LoginResponse, RefreshResponse, RefreshRequest
from src.controllers.auth_controller import login_handler, register_handler, refresh_token_handler
from typing import Any

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)) -> Any:
    """Registers a new user account.

    Request body: `email`, `username`, `password`.
    Response: empty success response; returns HTTP 409 if the email or username already exists.
    """
    return register_handler(req, db)

@router.post("/login", response_model=LoginResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)) -> LoginResponse:
    """Authenticates a user by email or username.

    Request body: `identifier`, `password`.
    Response: `success`, `access_token`, `refresh_token`, `token_type`.
    """
    return login_handler(req, db)

@router.post("/refresh-token", response_model=RefreshResponse)
def refresh_token(req: RefreshRequest, db: Session = Depends(get_db)) -> dict[str, Any]:
    """Issues a new access and refresh token pair from a valid refresh token.

    Request body: `refresh_token`.
    Response: `access_token`, `refresh_token`, `token_type`.
    """
    return refresh_token_handler(req, db)
