import sys
import os

# Inject project root into sys.path so 'backend' is resolvable
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # backend/alembic
BACKEND_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))
sys.path.insert(0, BACKEND_DIR)

from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
from dotenv import load_dotenv
from app.database import Base
from app import models

# Metadata for autogeneration
target_metadata = Base.metadata

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # backend/alembic
ROOT_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", ".."))  # project root

# Load environment variables
load_dotenv(os.path.join(ROOT_DIR, ".env"))

# Get DB URL
APP_ENV = os.getenv("APP_ENV", "development")

if APP_ENV == "testing":
    DATABASE_URL = os.getenv("TEST_DATABASE_URL")
else:
    DATABASE_URL = os.getenv("DATABASE_URL")

# Alembic Config
config = context.config
if DATABASE_URL:
    config.set_main_option("sqlalchemy.url", DATABASE_URL)

# Logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Migration runners
def run_migrations_offline():
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()

# Entry point
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()