from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
import os
from typing import Generator

# Get the database URL from environment variables with a default fallback
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:postgres@db:5432/rpn_calculator"
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# This works with FastAPI's dependency injection
def get_db() -> Generator[Session, None, None]:
    """
    Create a new database session and close it when done.
    This function is designed to be used as a FastAPI dependency.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db() -> None:
    """
    Initialize the database, creating all tables if they don't exist.
    """
    from core.db.models import Base
    Base.metadata.create_all(bind=engine) 