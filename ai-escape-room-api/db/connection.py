from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
import os
from collections.abc import Generator

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://escape:escape@localhost:5432/escape_room"
)

engine = create_engine(DATABASE_URL, future=True)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
