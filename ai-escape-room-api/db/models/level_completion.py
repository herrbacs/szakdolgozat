import uuid
from sqlalchemy import Float, ForeignKey, Index, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base


class LevelCompletion(Base):
    __tablename__ = "level_completions"

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

    completion_minutes: Mapped[float] = mapped_column(Float, nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "level_id", name="uq_level_completions_user_level"),
        Index("ix_level_completions_level_user", "level_id", "user_id"),
    )

    user = relationship("User", lazy="selectin")
    level = relationship("Level", lazy="selectin")
