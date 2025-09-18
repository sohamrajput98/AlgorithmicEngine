"""make user_id nullable in Submission

Revision ID: 27dccd5291b7
Revises: fa51a083de42
Create Date: 2025-09-18 12:15:43.730449

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '27dccd5291b7'
down_revision = 'fa51a083de42'
branch_labels = None
depends_on = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
