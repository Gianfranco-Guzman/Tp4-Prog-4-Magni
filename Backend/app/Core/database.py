from sqlmodel import create_engine, Session
from app.Core.config import DATABASE_URL

engine = create_engine(DATABASE_URL, echo=False)


def get_session():
    with Session(engine, expire_on_commit=False) as session:
        yield session
