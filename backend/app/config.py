from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()  # loads .env from root folder

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    TEST_DATABASE_URL: str = os.getenv("TEST_DATABASE_URL")
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
    APP_ENV: str = os.getenv("APP_ENV", "development") or "development"  # ✅ fallback ensures it's never None
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5175")

settings = Settings()