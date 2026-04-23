from sqlmodel import SQLModel


class ParticipanteCreate(SQLModel):
    nombre: str
    email: str
    edad: int
    pais: str
    modalidad: str
    tecnologias: list[str]
    nivel: str
    aceptaTerminos: bool


class ParticipanteRead(SQLModel):
    id: int
    nombre: str
    email: str
    edad: int
    pais: str
    modalidad: str
    tecnologias: list[str]
    nivel: str
    aceptaTerminos: bool
