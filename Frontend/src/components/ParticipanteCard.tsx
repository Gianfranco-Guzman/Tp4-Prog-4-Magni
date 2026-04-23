import { useParticipantes } from "../context/ParticipantesContext";
import type { DatosParticipante } from "../models/Participante";

const coloresPorNivel = {
  Principiante: "bg-green-100",
  Intermedio: "bg-yellow-100",
  Avanzado: "bg-red-100",
};

function ParticipanteCard({
  participante,
}: {
  participante: DatosParticipante;
}) {
  const { eliminar } = useParticipantes();

  return (
    <article
      className={`shadow rounded p-4 hover:shadow-lg transition ${
        coloresPorNivel[participante.nivel]
      }`}
    >
      <h3 className="text-xl font-bold mb-2">{participante.nombre}</h3>

      <p className="mb-1">
        <span className="font-semibold">Email:</span> {participante.email}
      </p>

      <p className="mb-1">
        <span className="font-semibold">Pais:</span> {participante.pais}
      </p>

      <p className="mb-1">
        <span className="font-semibold">Modalidad:</span> {participante.modalidad}
      </p>

      <p className="mb-1">
        <span className="font-semibold">Nivel:</span> {participante.nivel}
      </p>

      <p className="mb-1">
        <span className="font-semibold">Edad:</span> {participante.edad}
      </p>

      <p>
        <span className="font-semibold">Tecnologias:</span>{" "}
        {participante.tecnologias.join(" - ") || "Sin tecnologias"}
      </p>

      <button
        onClick={() => void eliminar(participante.id)}
        className="mt-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
      >
        Eliminar
      </button>
    </article>
  );
}

export default ParticipanteCard;
