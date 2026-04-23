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
  const { participantes, resetear } = useParticipantes();
  const [filtros, setFiltros] = useState<FiltrosState>(filtrosIniciales);

  const limpiarFiltros = () => {
    setFiltros(filtrosIniciales);
  };

  const resetearDatos = () => {
    void resetear();
    setFiltros(filtrosIniciales);
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
      <h1 className="text-3xl font-bold text-center">
        Registro de Participantes
      </h1>

      <div className="bg-blue-50 border border-blue-200 rounded p-4 text-lg font-medium">
        Mostrando {participantesFiltrados.length} de {participantes.length} participantes
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={resetearDatos}
          className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition"
        >
          Resetear datos
        </button>
      </div>

      <Formulario />

      <Filtros
        busqueda={filtros.busqueda}
        modalidad={filtros.modalidad}
        nivel={filtros.nivel}
        onCambiarFiltros={setFiltros}
        onLimpiar={limpiarFiltros}
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
