from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.connection import get_db
from db.models.user import User
from src.security.deps import get_current_user
from src.controllers.token_controller import profile_handler
from src.schemas.users import ProfileResponse

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=ProfileResponse)
def my_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return profile_handler(user, db)
