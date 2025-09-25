"""Add complexity fields to testcases

Revision ID: 6cf92dc8ebd7
Revises: 47f07a57075b
Create Date: 2025-09-25 15:41:01.538157

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6cf92dc8ebd7'
down_revision = '47f07a57075b'
branch_labels = None
depends_on = None


def upgrade() -> None:
    from sqlalchemy import String
    op.add_column('testcases', sa.Column('time_complexity', String(length=50), nullable=True))
    op.add_column('testcases', sa.Column('space_complexity', String(length=50), nullable=True))

def downgrade() -> None:
    op.drop_column('testcases', 'time_complexity')
    op.drop_column('testcases', 'space_complexity')