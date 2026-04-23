from sqlmodel import select

from app.Participante.participanteModel import Participante


class ParticipanteRepository:
    def __init__(self, session):
        self.session = session

    def obtener_todos(self):
        consulta = select(Participante)
        return self.session.exec(consulta).all()

    def obtener_por_id(self, participante_id: int):
        return self.session.get(Participante, participante_id)

    def crear(self, participante: Participante):
        self.session.add(participante)
        self.session.flush()
        self.session.refresh(participante)
        return participante

    def actualizar(self, participante: Participante):
        self.session.add(participante)
        self.session.flush()
        self.session.refresh(participante)
        return participante

    def eliminar(self, participante: Participante):
        self.session.delete(participante)
