import { useEffect, useMemo, useState } from "react";
import Formulario from "./components/Formulario";
import Filtros from "./components/Filtros";
import ParticipanteCard from "./components/ParticipanteCard";
import {
  filtrosIniciales,
  type FiltrosState,
} from "./components/filtros";
import { Participante, type DatosParticipante } from "./models/Participante";

const STORAGE_KEY = "participantes";

const participantesIniciales: Participante[] = [
  new Participante(
    1,
    "Juan Perez",
    "juan@mail.com",
    25,
    "Argentina",
    "Presencial",
    ["React", "Node"],
    "Intermedio",
    true,
  ),
  new Participante(
    2,
    "Ana Gomez",
    "ana@mail.com",
    30,
    "Chile",
    "Virtual",
    ["Angular", "Java"],
    "Avanzado",
    true,
  ),
  new Participante(
    3,
    "Luis Martinez",
    "luis@mail.com",
    22,
    "Mexico",
    "Hibrido",
    ["Vue", "Python"],
    "Principiante",
    true,
  ),
];

function App() {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [filtros, setFiltros] = useState<FiltrosState>(filtrosIniciales);
  const [estaInicializado, setEstaInicializado] = useState(false);

  useEffect(() => {
    const participantesGuardados = localStorage.getItem(STORAGE_KEY);

    if (!participantesGuardados) {
      setParticipantes(participantesIniciales);
      setEstaInicializado(true);
      return;
    }

    try {
      const participantesParseados: DatosParticipante[] = JSON.parse(participantesGuardados);
      setParticipantes(
        participantesParseados.map((participante) =>
          Participante.desdeObjeto(participante),
        ),
      );
    } catch {
      setParticipantes(participantesIniciales);
    } finally {
      setEstaInicializado(true);
    }
  }, []);

  useEffect(() => {
    if (!estaInicializado) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(participantes));
  }, [participantes, estaInicializado]);

  const agregarParticipante = (nuevo: Participante) => {
    setParticipantes((prev) => [...prev, nuevo]);
  };

  const eliminarParticipante = (id: number) => {
    setParticipantes((prev) => prev.filter((participante) => participante.id !== id));
  };

  const limpiarFiltros = () => {
    setFiltros(filtrosIniciales);
  };

  const resetearDatos = () => {
    localStorage.removeItem(STORAGE_KEY);
    setParticipantes(participantesIniciales);
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

      <Formulario onAgregar={agregarParticipante} />

      <Filtros
        busqueda={filtros.busqueda}
        modalidad={filtros.modalidad}
        nivel={filtros.nivel}
        onCambiarFiltros={setFiltros}
        onLimpiar={limpiarFiltros}
      />

      <section>
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
                onEliminar={eliminarParticipante}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
