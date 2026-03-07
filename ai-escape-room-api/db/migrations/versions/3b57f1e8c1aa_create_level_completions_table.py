"""create level completions table

Revision ID: 3b57f1e8c1aa
Revises: 2c916252d2d9
Create Date: 2026-03-07 16:55:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "3b57f1e8c1aa"
down_revision: Union[str, Sequence[str], None] = "2c916252d2d9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "level_completions",
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("level_id", sa.UUID(), nullable=False),
        sa.Column("completion_minutes", sa.Float(), nullable=False),
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["level_id"], ["levels.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", "level_id", name="uq_level_completions_user_level"),
    )
    op.create_index(op.f("ix_level_completions_level_id"), "level_completions", ["level_id"], unique=False)
    op.create_index("ix_level_completions_level_user", "level_completions", ["level_id", "user_id"], unique=False)
    op.create_index(op.f("ix_level_completions_user_id"), "level_completions", ["user_id"], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f("ix_level_completions_user_id"), table_name="level_completions")
    op.drop_index("ix_level_completions_level_user", table_name="level_completions")
    op.drop_index(op.f("ix_level_completions_level_id"), table_name="level_completions")
    op.drop_table("level_completions")
