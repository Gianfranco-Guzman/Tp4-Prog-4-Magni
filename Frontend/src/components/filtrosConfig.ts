export type FiltrosState = {
  busqueda: string;
  modalidad: string;
  nivel: string;
};

export const filtrosIniciales: FiltrosState = {
  busqueda: "",
  modalidad: "Todas",
  nivel: "Todos",
};
