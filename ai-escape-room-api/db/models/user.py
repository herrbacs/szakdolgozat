from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .user_token import UserToken


class User(Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False
    )

    username: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)

    tokens: Mapped["UserToken"] = relationship("UserToken", uselist=False, back_populates="user")
