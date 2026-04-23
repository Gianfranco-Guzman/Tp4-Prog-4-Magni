from fastapi import APIRouter, status

from app.Participante.participanteSchema import ParticipanteCreate, ParticipanteRead
from app.Participante.participanteService import ParticipanteService


router = APIRouter(tags=["Participantes"])
service = ParticipanteService()


@router.get("/participantes", response_model=list[ParticipanteRead])
def obtener_participantes():
    return service.obtener_participantes()


@router.post(
    "/participantes",
    response_model=ParticipanteRead,
    status_code=status.HTTP_201_CREATED,
)
def crear_participante(participante: ParticipanteCreate):
    return service.crear_participante(participante)


@router.put("/participantes/{participante_id}", response_model=ParticipanteRead)
def actualizar_participante(participante_id: int, participante: ParticipanteCreate):
    return service.actualizar_participante(participante_id, participante)


@router.delete("/participantes/{participante_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_participante(participante_id: int):
    service.eliminar_participante(participante_id)
