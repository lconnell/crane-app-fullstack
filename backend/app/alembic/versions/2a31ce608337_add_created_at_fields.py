"""Add created_at field to User and Item models

Revision ID: 2a31ce608337
Revises: 1a31ce608336
Create Date: 2024-03-24 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes
from datetime import datetime, UTC


# revision identifiers, used by Alembic.
revision = '2a31ce608337'
down_revision = '1a31ce608336'
branch_labels = None
depends_on = None


def upgrade():
    # Add created_at column to user table
    op.add_column('user', sa.Column('created_at', sa.DateTime(timezone=True), nullable=True))
    op.execute("UPDATE \"user\" SET created_at = CURRENT_TIMESTAMP")
    op.alter_column('user', 'created_at', nullable=False)

    # Add created_at column to item table
    op.add_column('item', sa.Column('created_at', sa.DateTime(timezone=True), nullable=True))
    op.execute("UPDATE item SET created_at = CURRENT_TIMESTAMP")
    op.alter_column('item', 'created_at', nullable=False)


def downgrade():
    # Remove created_at column from user table
    op.drop_column('user', 'created_at')

    # Remove created_at column from item table
    op.drop_column('item', 'created_at')
