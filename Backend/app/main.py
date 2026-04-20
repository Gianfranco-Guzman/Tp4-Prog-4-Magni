from fastapi import FastAPI
from contextlib import asynccontextmanager
from sqlmodel import SQLModel
from app.Core.database import engine
from app.Participante.participanteModel import Participante


@asynccontextmanager
async def lifespan(app: FastAPI):

    SQLModel.metadata.create_all(engine)
    yield


app = FastAPI(lifespan=lifespan)