from sqlmodel import SQLModel, Field
from typing import Optional


class Participante(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    email: str
    edad: int
    telefono: str
    modalidad: str
    nivel: str