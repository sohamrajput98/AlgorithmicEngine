import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from app.config import settings
import logging

# Determine environment: 'test' uses test DB, fallback to settings.APP_ENV
APP_ENV = os.getenv("APP_ENV", settings.APP_ENV)

# Validate environment
assert APP_ENV in {"test", "development", "production"}, f"Invalid APP_ENV: {APP_ENV}"

# Choose DB URL based on environment
db_url = settings.TEST_DATABASE_URL if APP_ENV == "test" else settings.DATABASE_URL

# Log active DB for visibility
logging.info(f"Using DB: {db_url} (env: {APP_ENV})")

# Create SQLAlchemy engine
engine = create_engine(db_url, echo=True, future=True)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=Session
)

# Base class for models
Base = declarative_base()

def get_db():
    """
    Provides a SQLAlchemy session, automatically using the correct DB
    based on APP_ENV. Use 'with get_db() as db:' or FastAPI dependency injection.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()