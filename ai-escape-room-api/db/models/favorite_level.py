from sqlalchemy import ForeignKey, UniqueConstraint, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base
import uuid


class FavoriteLevel(Base):
    __tablename__ = "favorite_levels"

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

    __table_args__ = (
        UniqueConstraint("user_id", "level_id", name="uq_favorite_levels_user_level"),
        Index("ix_favorite_levels_level_user", "level_id", "user_id"),
    )

    user = relationship("User", lazy="selectin")
    level = relationship("Level", lazy="selectin")