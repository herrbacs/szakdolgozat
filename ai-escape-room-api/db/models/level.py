from sqlalchemy import String, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base

class Level(Base):
    __tablename__ = "levels"

    title: Mapped[str] = mapped_column(
        String(255),
        unique=False,
        index=True,
        nullable=False
    )

    story: Mapped[str] = mapped_column(
        Text,
        unique=False,
        index=True,
        nullable=False
    )

    sucessfull_level_generation: Mapped[bool] = mapped_column(
        Boolean,
        unique=False,
        index=False,
        nullable=False
    )

    sucessfull_sprite_generation: Mapped[bool] = mapped_column(
        Boolean,
        unique=False,
        index=False,
        nullable=False
    )
