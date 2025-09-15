from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

# 🔧 Choose correct DB based on APP_ENV
db_url = (
    settings.TEST_DATABASE_URL
    if settings.APP_ENV == "test"
    else settings.DATABASE_URL
)

engine = create_engine(db_url, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()