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
    
    class Config:
        env_file = ".env"

settings = Settings()