from fastapi import HTTPException
from app.Core.unit_of_work import UnitOfWork
from app.Participante.participanteModel import Participante
from app.Participante.participanteRepository import ParticipanteRepository
from app.Participante.participanteSchema import ParticipanteCreate


class ParticipanteService:
    def obtener_participantes(self):
        with UnitOfWork() as uow:
            repositorio = ParticipanteRepository(uow.session)
            return repositorio.obtener_todos()

    def crear_participante(self, datos_participante: ParticipanteCreate):
        with UnitOfWork() as uow:
            repositorio = ParticipanteRepository(uow.session)

            nuevo_participante = Participante(
                nombre=datos_participante.nombre,
                email=datos_participante.email,
                edad=datos_participante.edad,
                pais=datos_participante.pais,
                modalidad=datos_participante.modalidad,
                tecnologias=datos_participante.tecnologias,
                nivel=datos_participante.nivel,
                aceptaTerminos=datos_participante.aceptaTerminos,
            )

            return repositorio.crear(nuevo_participante)

    def actualizar_participante(self, participante_id: int, datos_participante: ParticipanteCreate):
        with UnitOfWork() as uow:
            repositorio = ParticipanteRepository(uow.session)

            participante = repositorio.obtener_por_id(participante_id)

            if not participante:
                raise HTTPException(
                    status_code=404,
                    detail="Participante no encontrado",
                )

            participante.nombre = datos_participante.nombre
            participante.email = datos_participante.email
            participante.edad = datos_participante.edad
            participante.pais = datos_participante.pais
            participante.modalidad = datos_participante.modalidad
            participante.tecnologias = datos_participante.tecnologias
            participante.nivel = datos_participante.nivel
            participante.aceptaTerminos = datos_participante.aceptaTerminos

            return repositorio.actualizar(participante)

    def eliminar_participante(self, participante_id: int):
        with UnitOfWork() as uow:
            repositorio = ParticipanteRepository(uow.session)

            participante = repositorio.obtener_por_id(participante_id)

            if not participante:
                raise HTTPException(
                    status_code=404,
                    detail="Participante no encontrado",
                )

            repositorio.eliminar(participante)
