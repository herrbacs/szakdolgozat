from sqlalchemy import ForeignKey, Integer, CheckConstraint, UniqueConstraint, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base
import uuid
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .level import Level
    from .user import User

class LevelRating(Base):
    __tablename__ = "level_ratings"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    level_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("levels.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    rating: Mapped[int] = mapped_column(Integer, nullable=False)

    __table_args__ = (
        CheckConstraint("rating >= 1 AND rating <= 5", name="ck_level_ratings_rating_1_5"),
        UniqueConstraint("user_id", "level_id", name="uq_level_ratings_user_level"),
        Index("ix_level_ratings_level_id_user_id", "level_id", "user_id"),
    )

    user: Mapped["User"] = relationship("User", lazy="selectin")
    level: Mapped["Level"] = relationship("Level", lazy="selectin")
