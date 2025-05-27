# backend/app/config.py
from pydantic import BaseSettings, Field

class Settings(BaseSettings):
    # Por defecto un archivo SQLite en desarrollo
    DATABASE_URL: str = Field("sqlite:///./dev.db", env="DATABASE_URL")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
