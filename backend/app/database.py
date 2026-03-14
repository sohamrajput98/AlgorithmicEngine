import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# Determine environment
APP_ENV = os.getenv("APP_ENV", "development")

# Configure DB URL
if APP_ENV == "test":
    db_url = os.getenv("TEST_DATABASE_URL")
else:
    MYSQL_USER = os.getenv("MYSQLUSER")
    MYSQL_PASSWORD = os.getenv("MYSQLPASSWORD")
    MYSQL_HOST = os.getenv("MYSQLHOST")
    MYSQL_PORT = os.getenv("MYSQLPORT")
    MYSQL_DB = os.getenv("MYSQLDATABASE")
    db_url = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"

logging.info(f"Connecting to DB: {db_url} (env: {APP_ENV})")

# Create SQLAlchemy engine and session
engine = create_engine(db_url, echo=True, future=True)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=Session
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()