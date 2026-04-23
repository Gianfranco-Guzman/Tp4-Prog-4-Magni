import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";

import { useParticipantes } from "../context/ParticipantesContext";
import type {
  Modalidad,
  Nivel,
  DatosParticipante,
} from "../models/Participante";

type DatosFormulario = {
  nombre: string;
  email: string;
  edad: number;
  pais: string;
  modalidad: Modalidad;
  tecnologias: string[];
  nivel: Nivel;
  aceptaTerminos: boolean;
};

const datosIniciales: DatosFormulario = {
  nombre: "",
  email: "",
  edad: 18,
  pais: "Argentina",
  modalidad: "Presencial",
  tecnologias: [],
  nivel: "Principiante",
  aceptaTerminos: false,
};

function Formulario() {
  const { agregar, editar, participanteEnEdicion, limpiarEdicion } = useParticipantes();
  const [formulario, setFormulario] = useState<DatosFormulario>(datosIniciales);
  const [estoyEditando, setEstoyEditando] = useState(false);
  const [estoyGuardando, setEstoyGuardando] = useState(false);
  const [mostrarNotificacion, setMostrarNotificacion] = useState(false);
  const [tipoNotificacion, setTipoNotificacion] = useState<"exito" | "error">("exito");

  const tecnologiasDisponibles = ["React", "Angular", "Vue", "Node", "Python", "Java"];
  const paisesDisponibles = ["Argentina", "Chile", "Uruguay", "Mexico", "Espana"];
  const modalidadesDisponibles: Modalidad[] = ["Presencial", "Virtual", "Hibrido"];
  const nivelesDisponibles: Nivel[] = ["Principiante", "Intermedio", "Avanzado"];

  useEffect(() => {
    if (participanteEnEdicion) {
      setFormulario({
        nombre: participanteEnEdicion.nombre,
        email: participanteEnEdicion.email,
        edad: participanteEnEdicion.edad,
        pais: participanteEnEdicion.pais,
        modalidad: participanteEnEdicion.modalidad,
        tecnologias: participanteEnEdicion.tecnologias,
        nivel: participanteEnEdicion.nivel,
        aceptaTerminos: participanteEnEdicion.aceptaTerminos,
      });
      setEstoyEditando(true);
    }
  }, [participanteEnEdicion]);

  const manejarCambioInput = (
    evento: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = evento.target;

    if (type === "checkbox") {
      const checked = (evento.target as HTMLInputElement).checked;

      setFormulario((prev) => ({
        ...prev,
        [name]: checked,
      }));

      return;
    }

    setFormulario((prev) => ({
      ...prev,
      [name]: name === "edad" ? Number(value) : value,
    }));
  };

  const manejarCambioTecnologias = (tecnologia: string) => {
    setFormulario((prev) => {
      const yaExiste = prev.tecnologias.includes(tecnologia);

      if (yaExiste) {
        return {
          ...prev,
          tecnologias: prev.tecnologias.filter((tech) => tech !== tecnologia),
        };
      }

      return {
        ...prev,
        tecnologias: [...prev.tecnologias, tecnologia],
      };
    });
  };

  const manejarEnvio = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setEstoyGuardando(true);

    try {
      if (estoyEditando && participanteEnEdicion) {
        const participanteActualizado: DatosParticipante = {
          ...formulario,
          id: participanteEnEdicion.id,
        };
        await editar(participanteActualizado);
        limpiarEdicion();
      } else {
        await agregar(formulario);
      }

      setFormulario(datosIniciales);
      setEstoyEditando(false);
      setTipoNotificacion("exito");
      setMostrarNotificacion(true);

      setTimeout(() => {
        setMostrarNotificacion(false);
        const listado = document.getElementById("lista-participantes");
        if (listado) {
          listado.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 2000);
    } catch (error) {
      setTipoNotificacion("error");
      setMostrarNotificacion(true);
      setTimeout(() => {
        setMostrarNotificacion(false);
      }, 3000);
    } finally {
      setEstoyGuardando(false);
    }
  };

  const cancelarEdicion = () => {
    limpiarEdicion();
    setFormulario(datosIniciales);
    setEstoyEditando(false);
  };

  return (
    <>
      {mostrarNotificacion && (
        <div
          className={`fixed top-4 right-4 px-4 py-3 rounded shadow-lg text-white z-50 ${
            tipoNotificacion === "exito" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {tipoNotificacion === "exito"
            ? "Participante guardado correctamente"
            : "Error al guardar el participante"}
        </div>
      )}

      <form
        id="formulario-participante"
        onSubmit={(evento) => void manejarEnvio(evento)}
        className="bg-white shadow rounded p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
      <div>
        <label className="block mb-1 font-medium">Nombre</label>
        <input
          type="text"
          name="nombre"
          value={formulario.nombre}
          onChange={manejarCambioInput}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={formulario.email}
          onChange={manejarCambioInput}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Edad</label>
        <input
          type="number"
          name="edad"
          value={formulario.edad}
          onChange={manejarCambioInput}
          className="w-full border rounded px-3 py-2"
          min={1}
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Pais</label>
        <select
          name="pais"
          value={formulario.pais}
          onChange={manejarCambioInput}
          className="w-full border rounded px-3 py-2"
        >
          {paisesDisponibles.map((pais) => (
            <option key={pais} value={pais}>
              {pais}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2">
        <p className="mb-2 font-medium">Modalidad</p>
        <div className="flex gap-4 flex-wrap">
          {modalidadesDisponibles.map((modalidad) => (
            <label key={modalidad} className="flex items-center gap-2">
              <input
                type="radio"
                name="modalidad"
                value={modalidad}
                checked={formulario.modalidad === modalidad}
                onChange={manejarCambioInput}
              />
              {modalidad}
            </label>
          ))}
        </div>
      </div>

      <div className="md:col-span-2">
        <p className="mb-2 font-medium">Tecnologias</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {tecnologiasDisponibles.map((tecnologia) => (
            <label key={tecnologia} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formulario.tecnologias.includes(tecnologia)}
                onChange={() => manejarCambioTecnologias(tecnologia)}
              />
              {tecnologia}
            </label>
          ))}
        </div>
      </div>

      <div className="md:col-span-2">
        <label className="block mb-1 font-medium">Nivel de experiencia</label>
        <select
          name="nivel"
          value={formulario.nivel}
          onChange={manejarCambioInput}
          className="w-full border rounded px-3 py-2"
        >
          {nivelesDisponibles.map((nivel) => (
            <option key={nivel} value={nivel}>
              {nivel}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="aceptaTerminos"
            checked={formulario.aceptaTerminos}
            onChange={manejarCambioInput}
            required
          />
          Acepto los terminos y condiciones
        </label>
      </div>

      <div className="md:col-span-2 flex gap-2">
        <button
          type="submit"
          disabled={estoyGuardando}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {estoyGuardando
            ? "Guardando..."
            : estoyEditando
              ? "Guardar cambios"
              : "Registrar participante"}
        </button>

        {estoyEditando && (
          <button
            type="button"
            onClick={cancelarEdicion}
            disabled={estoyGuardando}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
    </>
  );
}

export default Formulario;
