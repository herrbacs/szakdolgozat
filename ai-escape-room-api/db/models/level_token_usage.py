from sqlalchemy import ForeignKey, Integer, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base
import uuid


class LevelTokenUsage(Base):
    __tablename__ = "level_token_usage"

    level_id: Mapped[uuid.UUID] = mapped_column(
        UUID,
        ForeignKey("levels.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    total_tokens: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    generation_tokens: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    validation_tokens: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    repair_tokens: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    sprite_tokens: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    repair_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    level = relationship("Level", lazy="selectin")
