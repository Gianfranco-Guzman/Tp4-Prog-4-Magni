import type { FiltrosState } from "./filtros";

function Filtros({
  busqueda,
  modalidad,
  nivel,
  onCambiarFiltros,
  onLimpiar,
}: {
  busqueda: string;
  modalidad: string;
  nivel: string;
  onCambiarFiltros: (filtros: FiltrosState) => void;
  onLimpiar: () => void;
}) {
  const manejarCambio = (
    evento: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = evento.target;

    onCambiarFiltros({
      busqueda,
      modalidad,
      nivel,
      [name]: value,
    } as FiltrosState);
  };

  return (
    <section className="bg-white shadow rounded p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 font-medium">Buscar</label>
          <input
            type="text"
            name="busqueda"
            value={busqueda}
            onChange={manejarCambio}
            placeholder="Buscar por nombre"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Modalidad</label>
          <select
            name="modalidad"
            value={modalidad}
            onChange={manejarCambio}
            className="w-full border rounded px-3 py-2"
          >
            <option value="Todas">Todas</option>
            <option value="Presencial">Presencial</option>
            <option value="Virtual">Virtual</option>
            <option value="Hibrido">Hibrido</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Nivel</label>
          <select
            name="nivel"
            value={nivel}
            onChange={manejarCambio}
            className="w-full border rounded px-3 py-2"
          >
            <option value="Todos">Todos</option>
            <option value="Principiante">Principiante</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onLimpiar}
          className="bg-slate-200 text-slate-800 px-4 py-2 rounded hover:bg-slate-300 transition"
        >
          Limpiar filtros
        </button>
      </div>
    </section>
  );
}

export default Filtros;
