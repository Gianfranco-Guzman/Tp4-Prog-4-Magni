from sqlmodel import Session
from app.Core.database import engine


class UnitOfWork:
    def __enter__(self):
        self.session = Session(engine)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type:
            self.session.rollback()
        else:
            self.session.commit()
        self.session.close()