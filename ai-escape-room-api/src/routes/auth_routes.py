from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select, or_
from db.connection import get_db
from db.models.user import User
from src.schemas.auth import RegisterRequest, LoginRequest, AuthResult
from src.security.password import hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=AuthResult)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing_user_query = select(User).where(or_(User.email == req.email, User.username == req.username))
    existing = db.execute(existing_user_query).scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email or username already exists."
        )

    user = User(
        email=req.email,
        username=req.username,
        password_hash=hash_password(req.password),
    )

    db.add(user)
    db.commit()

    return AuthResult(success=True)


@router.post("/login", response_model=AuthResult)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user_query = select(User).where(or_(User.email == req.identifier, User.username == req.identifier))
    user = db.execute(user_query).scalar_one_or_none()

    if not user:
        return AuthResult(success=False)

    ok = verify_password(req.password, user.password_hash)
    return AuthResult(success=ok)