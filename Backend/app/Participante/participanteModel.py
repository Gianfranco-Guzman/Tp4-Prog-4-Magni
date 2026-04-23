from sqlmodel import SQLModel, Field
from sqlalchemy import Column, JSON
from typing import Optional


class Participante(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    email: str
    edad: int
    pais: str
    modalidad: str
    tecnologias: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    nivel: str
    aceptaTerminos: bool
