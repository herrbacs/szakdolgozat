from sqlalchemy import String, Boolean, Text, Integer
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

    difficulty: Mapped[int] = mapped_column(
        Integer,
        unique=False,
        index=True,
        nullable=False,
        default=3
    )

    sprite_style: Mapped[str] = mapped_column(
        String(50),
        unique=False,
        index=False,
        nullable=False,
        default="Cartoon"
    )
