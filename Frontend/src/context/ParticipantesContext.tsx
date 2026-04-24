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

import { participantesEjemplo } from "../data/datosEjemplo";

type Action =
  | { type: "GET_PARTICIPANTES"; payload: DatosParticipante[] }
  | { type: "AGREGAR"; payload: DatosParticipante }
  | { type: "ELIMINAR"; payload: number }
  | { type: "EDITAR"; payload: DatosParticipante }
  | { type: "CARGAR_EDICION"; payload: DatosParticipante }
  | { type: "LIMPIAR_EDICION" };

type ParticipantesState = {
  participantes: DatosParticipante[];
  participanteEnEdicion: DatosParticipante | null;
};

function participantesReducer(state: ParticipantesState, action: Action): ParticipantesState {
  switch (action.type) {
    case "GET_PARTICIPANTES":
      return {
        ...state,
        participantes: action.payload,
      };

    case "AGREGAR":
      return {
        ...state,
        participantes: [...state.participantes, action.payload],
      };

    case "ELIMINAR":
      return {
        ...state,
        participantes: state.participantes.filter(
          (participante) => participante.id !== action.payload
        ),
      };

    case "EDITAR":
      return {
        ...state,
        participantes: state.participantes.map((participante) =>
          participante.id === action.payload.id ? action.payload : participante
        ),
        participanteEnEdicion: null,
      };

    case "CARGAR_EDICION":
      return {
        ...state,
        participanteEnEdicion: action.payload,
      };

    case "LIMPIAR_EDICION":
      return {
        ...state,
        participanteEnEdicion: null,
      };

    default:
      return state;
  }
}

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
  cargarDatosEjemplo: () => Promise<void>;
};

type ParticipantesProviderProps = {
  children: ReactNode;
};

const ParticipantesContext = createContext<ParticipantesContextType | undefined>(undefined);

export function ParticipantesProvider({ children }: ParticipantesProviderProps) {
  const [state, dispatch] = useReducer(participantesReducer, estadoInicial);

  const cargarParticipantes = async () => {
    const datos = await obtenerParticipantes();
    dispatch({ type: "GET_PARTICIPANTES", payload: datos });
  };

  useEffect(() => {
    void cargarParticipantes();
  }, []);

  const agregar = async (participante: ParticipanteCreate) => {
    const nuevoParticipante = await crearParticipante(participante);
    dispatch({ type: "AGREGAR", payload: nuevoParticipante });
  };

  const eliminar = async (id: number) => {
    await eliminarParticipante(id);
    dispatch({ type: "ELIMINAR", payload: id });
  };

  const editar = async (participante: DatosParticipante) => {
    const participanteActualizado = await actualizarParticipante(
      participante.id,
      participante
    );
    dispatch({ type: "EDITAR", payload: participanteActualizado });
  };

  const resetear = async () => {
    await cargarParticipantes();
  };

  const cargarDatosEjemplo = async () => {
    for (const participante of participantesEjemplo) {
      const { id, ...datosParaCrear } = participante;
      await crearParticipante(datosParaCrear);
    }
    await cargarParticipantes();
  };

  const cargarEdicion = (participante: DatosParticipante) => {
    dispatch({ type: "CARGAR_EDICION", payload: participante });
  };

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
        cargarDatosEjemplo,
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
