import type { DatosParticipante } from "../models/Participante";

export type ParticipanteCreate = Omit<DatosParticipante, "id">;

const API_URL = "http://localhost:8000/participantes";

export async function obtenerParticipantes(): Promise<DatosParticipante[]> {
  const respuesta = await fetch(API_URL);

  if (!respuesta.ok) {
    throw new Error("Error al obtener participantes");
  }

  return respuesta.json();
}

export async function crearParticipante(
  participante: ParticipanteCreate,
): Promise<DatosParticipante> {
  const respuesta = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(participante),
  });

  if (!respuesta.ok) {
    throw new Error("Error al crear participante");
  }

  return respuesta.json();
}

export async function actualizarParticipante(
  id: number,
  participante: ParticipanteCreate,
): Promise<DatosParticipante> {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(participante),
  });

  if (!respuesta.ok) {
    throw new Error("Error al actualizar participante");
  }

  return respuesta.json();
}

export async function eliminarParticipante(id: number): Promise<void> {   //para que es el void?
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!respuesta.ok) {
    throw new Error("Error al eliminar participante");
  }
}
