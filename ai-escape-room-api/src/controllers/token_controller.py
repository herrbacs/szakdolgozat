from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from db.models.user import User
from db.models.user_tokens import UserTokens
from src.schemas.tokens import TokenCategory
from src.models.service_types import ProfileData


def profile_handler(user: User, db: Session) -> ProfileData:
    """Builds the authenticated user's profile data with the current token balance.

    Input: authenticated `User` and database session.
    Output: profile dictionary containing `id`, `email`, `username`, and `tokens`.
    """
    tokens_entry = db.execute(select(UserTokens).where(UserTokens.user_id == user.id)).scalar_one_or_none()
    balance = tokens_entry.balance if tokens_entry else 0
    return {"id": user.id, "email": user.email, "username": user.username, "tokens": balance}


def buy_tokens_handler(category: TokenCategory, user: User, db: Session) -> dict[str, int]:
    """Increases a user's token balance by the selected purchase category.

    Input: `category` (`basic`, `medium`, `high`), authenticated `User`, database session.
    Output: dictionary with `new_balance`.
    """
    mapping = {
        TokenCategory.basic: 50000,
        TokenCategory.medium: 75000,
        TokenCategory.high: 100000,
    }
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
