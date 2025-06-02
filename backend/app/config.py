# backend/app/config.py
from pydantic import BaseSettings # Updated import for Pydantic v2+ style
from dotenv import load_dotenv
import os

# Load .env file if it exists (for local development)
load_dotenv()

class Settings(BaseSettings):
    # Database settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./dev.db")

    # JWT settings
    # Generate a new key with: openssl rand -hex 32
    # In a real production scenario, SECRET_KEY should NEVER be hardcoded directly in source
    # and should be loaded from a secure environment variable or a secrets management system.
    SECRET_KEY: str = os.getenv("SECRET_KEY", "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        # For Pydantic v2, use model_config if you need extra settings like case_sensitive
        # model_config = {"case_sensitive": True} 

settings = Settings()
