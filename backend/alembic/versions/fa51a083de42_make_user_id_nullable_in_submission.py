"""make user_id nullable in Submission

Revision ID: fa51a083de42
Revises: f11b398bca78
Create Date: 2025-09-18 12:12:17.532672

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fa51a083de42'
down_revision = 'f11b398bca78'
branch_labels = None
depends_on = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
