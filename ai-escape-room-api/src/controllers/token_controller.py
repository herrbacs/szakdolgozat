from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from db.models.user import User
from db.models.user_tokens import UserTokens


def profile_handler(user: User, db: Session):
    tokens_entry = db.execute(select(UserTokens).where(UserTokens.user_id == user.id)).scalar_one_or_none()
    balance = tokens_entry.balance if tokens_entry else 0
    return {"id": user.id, "email": user.email, "username": user.username, "tokens": balance}


def buy_tokens_handler(category: str, user: User, db: Session):
    mapping = {"basic": 100, "medium": 500, "high": 1000}
    if category not in mapping:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid purchase category")
    amount = mapping[category]

    tokens_entry = db.execute(select(UserTokens).where(UserTokens.user_id == user.id)).scalar_one_or_none()
    if tokens_entry is None:
        tokens_entry = UserTokens(user_id=user.id, balance=0)
        db.add(tokens_entry)
        db.commit()
        db.refresh(tokens_entry)

    tokens_entry.balance += amount
    db.commit()
    return {"new_balance": tokens_entry.balance}
