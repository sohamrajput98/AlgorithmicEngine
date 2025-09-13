# backend/test_db.py
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

load_dotenv()  # loads .env file

engine = create_engine(os.getenv("DATABASE_URL"))

with engine.connect() as conn:
    result = conn.execute("SELECT DATABASE();")
    print(result.fetchone())
