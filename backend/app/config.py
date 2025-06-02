# backend/app/config.py
from pydantic import BaseSettings # Updated import for Pydantic v2+ style
from dotenv import load_dotenv
import os
from pathlib import Path

# Load .env file if it exists (for local development)
load_dotenv()

class Settings(BaseSettings):
    BASE_DIR = Path(__file__).resolve().parent.parent
    DATABASE_URL: str = f"sqlite:///{BASE_DIR}/dev.db"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))  # Default to 30 minutes if not set
    CORS_ORIGINS: list[str] = ["*"]  # Allow all origins by default

    class Config:
        env_file = ".env"

settings = Settings()