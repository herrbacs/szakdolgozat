from sqlalchemy import ForeignKey, Integer, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base
import uuid


from enum import Enum
from sqlalchemy import String, Float


class UsageType(str, Enum):
    GENERATION = "generation"
    VALIDATION = "validation"
    REPAIR = "repair"
    SPRITE = "sprite"


class LevelTokenUsage(Base):
    __tablename__ = "level_token_usage"

    # primary key so that we can have multiple rows per level
    id: Mapped[uuid.UUID] = mapped_column(UUID, primary_key=True, default=uuid.uuid4)

    level_id: Mapped[uuid.UUID] = mapped_column(
        UUID,
        ForeignKey("levels.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    usage_type: Mapped[UsageType] = mapped_column(String, nullable=False)

    tokens: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    minutes: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)

    level = relationship("Level", lazy="selectin")
