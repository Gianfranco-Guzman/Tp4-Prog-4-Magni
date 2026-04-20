from sqlmodel import SQLModel


class ParticipanteCreate(SQLModel):
    nombre: str
    email: str
    edad: int
    telefono: str
    modalidad: str
    nivel: str


class ParticipanteRead(SQLModel):
    id: int
    nombre: str
    email: str
    edad: int
    telefono: str
    modalidad: str
    nivel: str