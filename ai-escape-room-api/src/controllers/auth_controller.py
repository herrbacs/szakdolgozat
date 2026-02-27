from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select, or_
from db.connection import get_db
from db.models.user import User
from src.schemas.auth import RegisterRequest, LoginRequest, RefreshRequest, LoginResponse, AuthResult
from src.security.password import hash_password, verify_password
from fastapi import Depends
from sqlalchemy import select, or_
from sqlalchemy.orm import Session
from src.security.jwt import create_access_token, create_refresh_token, decode_token
from db.models.user import User
from db.models.refresh_token import RefreshToken
from jose import JWTError, ExpiredSignatureError

def register_handler(req: RegisterRequest, db: Session = Depends(get_db)):
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

def login_handler(req: LoginRequest, db: Session = Depends(get_db)) -> LoginResponse:
    user_query = select(User).where(or_(User.email == req.identifier, User.username == req.identifier))
    user = db.execute(user_query).scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    ok = verify_password(req.password, user.password_hash)
    if not ok:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    access = create_access_token(user_id=user.id)
    refresh, refresh_exp = create_refresh_token(user_id=user.id)

    db.add(RefreshToken(user_id=user.id, token=refresh, expires_at=refresh_exp, revoked=False))
    db.commit()

    return LoginResponse(success=True, access_token=access, refresh_token=refresh)

def refresh_token_handler(req: RefreshRequest, db: Session):
    token = req.refresh_token

    try:
        payload = decode_token(token)
    except ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")

    sub = payload.get("sub")
    if not sub:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    rt = db.execute(
        select(RefreshToken).where(RefreshToken.token == token)
    ).scalar_one_or_none()

    if not rt:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token not found")

    if rt.revoked:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token revoked")

    if str(rt.user_id) != str(sub):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    user = db.execute(select(User).where(User.id == rt.user_id)).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    rt.revoked = True

    new_access = create_access_token(user_id=user.id)
    new_refresh, new_refresh_exp = create_refresh_token(user_id=user.id)

    db.add(RefreshToken(user_id=user.id, token=new_refresh, expires_at=new_refresh_exp, revoked=False))
    db.commit()

    return {
        "access_token": new_access,
        "refresh_token": new_refresh,
        "token_type": "bearer",
    }