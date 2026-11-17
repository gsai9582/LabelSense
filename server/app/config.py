import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "LabelSense Verification API"
    VERSION: str = "1.2.0"
    API_V1_STR: str = "/api"
    
    # Database: SQLite default, MySQL-ready via DATABASE_URL env var
    # e.g. mysql+pymysql://user:pass@host:3306/labelsense
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./labelsense.db")
    
    # JWT & Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "labelsense_clinical_insecure_default_dev_key_88301")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 12 # 12 hours
    
    # Storage & Upload limits
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./uploads")
    MAX_UPLOAD_SIZE_BYTES: int = 25 * 1024 * 1024  # 25 MB limit
    ALLOWED_MIME_TYPES: list[str] = [
        "application/pdf",
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/tiff",
    ]

    model_config = {"case_sensitive": True}

settings = Settings()
