from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.connection import get_db
from src.schemas.tokens import TokenPurchaseRequest, TokenPurchaseResponse
from src.controllers.token_controller import buy_tokens_handler
from db.models.user import User
from src.security.deps import get_current_user

router = APIRouter(prefix="/tokens", tags=["tokens"])

@router.post("/buy", response_model=TokenPurchaseResponse)
def buy_tokens(
    req: TokenPurchaseRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TokenPurchaseResponse:
    """Purchases a token package for the authenticated user.

    Request body: `category` (`basic`, `medium`, `high`); authentication required.
    Response: `new_balance`, the updated token balance.
    """
    return buy_tokens_handler(req.category, user, db)
