import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";

import type { DatosParticipante } from "../models/Participante";

import {
  obtenerParticipantes,
  crearParticipante,
  eliminarParticipante,
  actualizarParticipante,
  type ParticipanteCreate,
} from "../api/participantesApi";

// Definir todas las acciones posibles que el reducer puede procesar
type Action =
  | { type: "GET_PARTICIPANTES"; payload: DatosParticipante[] }
  | { type: "AGREGAR"; payload: DatosParticipante }
  | { type: "ELIMINAR"; payload: number }
  | { type: "EDITAR"; payload: DatosParticipante }
  | { type: "RESET"; payload: DatosParticipante[] }
  | { type: "CARGAR_EDICION"; payload: DatosParticipante }
  | { type: "LIMPIAR_EDICION" };

// El estado que maneja el reducer
type ParticipantesState = {
  participantes: DatosParticipante[];
  participanteEnEdicion: DatosParticipante | null;
};

// Función reducer: recibe estado actual + acción, devuelve nuevo estado
function participantesReducer(state: ParticipantesState, action: Action): ParticipantesState {
  switch (action.type) {
    case "GET_PARTICIPANTES":
      // Cuando cargamos los participantes del backend
      return {
        ...state,
        participantes: action.payload,
      };

    case "AGREGAR":
      // Agregamos un nuevo participante a la lista
      return {
        ...state,
        participantes: [...state.participantes, action.payload],
      };

    case "ELIMINAR":
      // Eliminamos el participante con el id especificado
      return {
        ...state,
        participantes: state.participantes.filter(
          (participante) => participante.id !== action.payload
        ),
      };

    case "EDITAR":
      // Actualizamos el participante que tiene el mismo id
      return {
        ...state,
        participantes: state.participantes.map((participante) =>
          participante.id === action.payload.id ? action.payload : participante
        ),
        participanteEnEdicion: null,
      };

    case "RESET":
      // Recargamos toda la lista
      return {
        ...state,
        participantes: action.payload,
      };

    case "CARGAR_EDICION":
      // Cargar un participante para editar
      return {
        ...state,
        participanteEnEdicion: action.payload,
      };

    case "LIMPIAR_EDICION":
      // Limpiar el participante en edición
      return {
        ...state,
        participanteEnEdicion: null,
      };

    default:
      return state;
  }
}

// Estado inicial del reducer
const estadoInicial: ParticipantesState = {
  participantes: [],
  participanteEnEdicion: null,
};

type ParticipantesContextType = {
  participantes: DatosParticipante[];
  participanteEnEdicion: DatosParticipante | null;
  agregar: (participante: ParticipanteCreate) => Promise<void>;
  eliminar: (id: number) => Promise<void>;
  editar: (participante: DatosParticipante) => Promise<void>;
  cargarEdicion: (participante: DatosParticipante) => void;
  limpiarEdicion: () => void;
  resetear: () => Promise<void>;
};

type ParticipantesProviderProps = {
  children: ReactNode;
};

const ParticipantesContext = createContext<ParticipantesContextType | undefined>(undefined);

export function ParticipantesProvider({ children }: ParticipantesProviderProps) {
  // Usar useReducer en lugar de useState
  const [state, dispatch] = useReducer(participantesReducer, estadoInicial);

  // Cargar participantes cuando el componente monta
  const cargarParticipantes = async () => {
    const datos = await obtenerParticipantes();
    // Enviamos acción GET_PARTICIPANTES al reducer
    dispatch({ type: "GET_PARTICIPANTES", payload: datos });
  };

  useEffect(() => {
    void cargarParticipantes();
  }, []);

  // Agregar un nuevo participante
  const agregar = async (participante: ParticipanteCreate) => {
    const nuevoParticipante = await crearParticipante(participante);
    // Enviamos acción AGREGAR al reducer
    dispatch({ type: "AGREGAR", payload: nuevoParticipante });
  };

  // Eliminar un participante
  const eliminar = async (id: number) => {
    await eliminarParticipante(id);
    // Enviamos acción ELIMINAR al reducer
    dispatch({ type: "ELIMINAR", payload: id });
  };

  // Editar un participante (NUEVO en TP5)
  const editar = async (participante: DatosParticipante) => {
    const participanteActualizado = await actualizarParticipante(
      participante.id,
      participante
    );
    // Enviamos acción EDITAR al reducer
    dispatch({ type: "EDITAR", payload: participanteActualizado });
  };

  // Recargar todos los participantes
  const resetear = async () => {
    await cargarParticipantes();
  };

  // Cargar participante para editar
  const cargarEdicion = (participante: DatosParticipante) => {
    dispatch({ type: "CARGAR_EDICION", payload: participante });
  };

  // Limpiar participante en edición
  const limpiarEdicion = () => {
    dispatch({ type: "LIMPIAR_EDICION" });
  };

  return (
    <ParticipantesContext.Provider
      value={{
        participantes: state.participantes,
        participanteEnEdicion: state.participanteEnEdicion,
        agregar,
        eliminar,
        editar,
        cargarEdicion,
        limpiarEdicion,
        resetear,
      }}
    >
      {children}
    </ParticipantesContext.Provider>
  );
}

export function useParticipantes() {
  const context = useContext(ParticipantesContext);

  if (!context) {
    throw new Error("useParticipantes debe usarse dentro de ParticipantesProvider");
  }

  return context;
}
