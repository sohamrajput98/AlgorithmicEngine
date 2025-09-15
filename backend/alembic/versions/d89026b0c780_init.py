"""Init

Revision ID: d89026b0c780
Revises: c1c713ec2bf3
Create Date: 2025-09-14 10:31:14.772821

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'd89026b0c780'
down_revision = 'c1c713ec2bf3'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Create independent tables first
    op.create_table('badges',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('key', sa.String(length=100), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('criteria_json', sa.Text(), nullable=True),
        sa.Column('icon_path', sa.String(length=255), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('key')
    )
    op.create_index(op.f('ix_badges_id'), 'badges', ['id'], unique=False)

    op.create_table('contests',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('start_time', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
        sa.Column('end_time', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_contests_id'), 'contests', ['id'], unique=False)

    op.create_table('feature_flags',
        sa.Column('key', sa.String(length=100), nullable=False),
        sa.Column('enabled', sa.Boolean(), nullable=True),
        sa.Column('meta', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('key')
    )

    op.create_table('problems',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('statement', sa.Text(), nullable=False),
        sa.Column('stars', sa.Integer(), nullable=True),
        sa.Column('tags', sa.String(length=255), nullable=True),
        sa.Column('difficulty_notes', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_problems_id'), 'problems', ['id'], unique=False)

    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('display_name', sa.String(length=100), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
        sa.Column('role', sa.String(length=50), nullable=True),
        sa.Column('profile_fields', sa.String(length=1000), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    op.create_table('accounts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('type', sa.String(length=50), nullable=True),
        sa.Column('url', sa.String(length=255), nullable=True),
        sa.Column('username', sa.String(length=100), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_accounts_id'), 'accounts', ['id'], unique=False)

    op.create_table('analytics',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('solved_count', sa.Integer(), nullable=True),
        sa.Column('accuracy', sa.Integer(), nullable=True),
        sa.Column('current_streak', sa.Integer(), nullable=True),
        sa.Column('longest_streak', sa.Integer(), nullable=True),
        sa.Column('avg_solve_time_ms', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id')
    )
    op.create_index(op.f('ix_analytics_id'), 'analytics', ['id'], unique=False)

    op.create_table('ratings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_ratings_id'), 'ratings', ['id'], unique=False)

    # Create dependent tables last
    op.create_table('submissions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('problem_id', sa.Integer(), nullable=False),
        sa.Column('code', sa.Text(), nullable=False),
        sa.Column('language', sa.String(length=50), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=True),
        sa.Column('runtime_ms', sa.Integer(), nullable=True),
        sa.Column('memory_kb', sa.Integer(), nullable=True),
        sa.Column('result_log', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['problem_id'], ['problems.id']),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_submissions_id'), 'submissions', ['id'], unique=False)

    op.create_table('testcases',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('problem_id', sa.Integer(), nullable=False),
        sa.Column('input_data', sa.Text(), nullable=False),
        sa.Column('expected_output', sa.Text(), nullable=False),
        sa.Column('is_sample', sa.Boolean(), nullable=True),
        sa.Column('time_limit_ms', sa.Integer(), nullable=True),
        sa.Column('memory_limit_kb', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['problem_id'], ['problems.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_testcases_id'), 'testcases', ['id'], unique=False)
    # ### end Alembic commands ###

def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_testcases_id'), table_name='testcases')
    op.drop_table('testcases')
    op.drop_index(op.f('ix_submissions_id'), table_name='submissions')
    op.drop_table('submissions')
    op.drop_index(op.f('ix_ratings_id'), table_name='ratings')
    op.drop_table('ratings')
    op.drop_index(op.f('ix_analytics_id'), table_name='analytics')
    op.drop_table('analytics')
    op.drop_index(op.f('ix_accounts_id'), table_name='accounts')
    op.drop_table('accounts')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')
    op.drop_index(op.f('ix_problems_id'), table_name='problems')
    op.drop_table('problems')
    op.drop_table('feature_flags')
    op.drop_index(op.f('ix_contests_id'), table_name='contests')
    op.drop_table('contests')
    op.drop_index(op.f('ix_badges_id'), table_name='badges')
    op.drop_table('badges')
    # ### end Alembic commands ###