import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { DatosParticipante } from "../models/Participante";

import {
  obtenerParticipantes,
  crearParticipante,
  eliminarParticipante,
  type ParticipanteCreate,
} from "../api/participantesApi";

type ParticipantesContextType = {
  participantes: DatosParticipante[];
  agregar: (participante: ParticipanteCreate) => Promise<void>;
  eliminar: (id: number) => Promise<void>;
  resetear: () => Promise<void>;
};

type ParticipantesProviderProps = {
  children: ReactNode;
};

const ParticipantesContext = createContext<ParticipantesContextType | undefined>(undefined);

export function ParticipantesProvider({ children }: ParticipantesProviderProps) {
  const [participantes, setParticipantes] = useState<DatosParticipante[]>([]);

  const cargarParticipantes = async () => {
    const datos = await obtenerParticipantes();
    setParticipantes(datos);
  };

  useEffect(() => {
    void cargarParticipantes();
  }, []);

  const agregar = async (participante: ParticipanteCreate) => {
    const nuevoParticipante = await crearParticipante(participante);
    setParticipantes((prev) => [...prev, nuevoParticipante]);
  };

  const eliminar = async (id: number) => {
    await eliminarParticipante(id);
    setParticipantes((prev) => prev.filter((participante) => participante.id !== id));
  };

  const resetear = async () => {
    await cargarParticipantes();
  };

  return (
    <ParticipantesContext.Provider
      value={{
        participantes,
        agregar,
        eliminar,
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
