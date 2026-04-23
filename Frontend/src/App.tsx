import { useMemo, useState } from "react";

import Formulario from "./components/Formulario";
import Filtros from "./components/Filtros";
import ParticipanteCard from "./components/ParticipanteCard";
import {
  filtrosIniciales,
  type FiltrosState,
} from "./components/filtrosConfig";
import { useParticipantes } from "./context/ParticipantesContext";

function App() {
  const { participantes, cargarDatosEjemplo } = useParticipantes();
  const [filtros, setFiltros] = useState<FiltrosState>(filtrosIniciales);
  const [mostrarNotificacion, setMostrarNotificacion] = useState(false);

  const limpiarFiltros = () => {
    setFiltros(filtrosIniciales);
  };

  const cargarDatos = async () => {
    await cargarDatosEjemplo();
    setFiltros(filtrosIniciales);
    setMostrarNotificacion(true);
    setTimeout(() => {
      setMostrarNotificacion(false);
      const listado = document.getElementById("lista-participantes");
      if (listado) {
        listado.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 2000);
  };

  const participantesFiltrados = useMemo(() => {
    return participantes.filter((participante) => {
      const coincideNombre = participante.nombre
        .toLowerCase()
        .includes(filtros.busqueda.toLowerCase());

      const coincideModalidad =
        filtros.modalidad === "Todas" ||
        participante.modalidad === filtros.modalidad;

      const coincideNivel =
        filtros.nivel === "Todos" || participante.nivel === filtros.nivel;

      return coincideNombre && coincideModalidad && coincideNivel;
    });
  }, [participantes, filtros]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {mostrarNotificacion && (
        <div className="fixed top-4 right-4 px-4 py-3 rounded shadow-lg text-white z-50 bg-blue-500">
          Datos de prueba cargados correctamente
        </div>
      )}

      <h1 className="text-3xl font-bold text-center">
        Registro de Participantes
      </h1>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => void cargarDatos()}
          className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition"
        >
          Cargar datos de prueba
        </button>
      </div>

      <Formulario />

      <Filtros
        busqueda={filtros.busqueda}
        modalidad={filtros.modalidad}
        nivel={filtros.nivel}
        onCambiarFiltros={setFiltros}
        onLimpiar={limpiarFiltros}
        totalParticipantes={participantes.length}
        participantesFiltrados={participantesFiltrados.length}
      />

      <section id="lista-participantes">
        <h2 className="text-xl font-semibold mb-4">Lista de participantes</h2>

        {participantesFiltrados.length === 0 ? (
          <div className="bg-white shadow rounded p-6 text-center text-slate-600">
            No hay participantes
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {participantesFiltrados.map((participante) => (
              <ParticipanteCard
                key={participante.id}
                participante={participante}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
