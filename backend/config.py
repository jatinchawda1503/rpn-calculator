import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    """
    Application settings for the RPN Calculator backend.
    All settings can be overridden with environment variables.
    """
    
    # API settings
    API_PORT: int = int(os.getenv("API_PORT", 8000))
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    
    # Database settings
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres:postgres@db:5432/rpn_calculator"
    )
    
    # Frontend settings (for CORS)
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
    # Logging settings
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    class Config:
        env_file = ".env"

# Create a settings instance
settings = Settings()
