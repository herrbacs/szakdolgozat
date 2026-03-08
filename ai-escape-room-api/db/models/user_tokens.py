from sqlalchemy import ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base
import uuid
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .user import User


class UserTokens(Base):
    __tablename__ = "user_tokens"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    balance: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    user: Mapped["User"] = relationship("User", lazy="selectin", back_populates="tokens")
