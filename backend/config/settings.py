"""
Configuration settings for BeatCoders backend
"""
from pydantic import BaseSettings
from typing import List

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "BeatCoders"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:3000",  # For future React/Next.js frontend
    ]
    
    # Database (optional for now)
    DATABASE_URL: str = "sqlite:///./beatcoders.db"
    
    # Security (optional for now)
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Code Execution
    MAX_EXECUTION_TIME: int = 5  # seconds
    MAX_MEMORY_MB: int = 128
    
    # Analysis
    ENABLE_ML_ANALYSIS: bool = False  # Set to True when ML model is ready
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
