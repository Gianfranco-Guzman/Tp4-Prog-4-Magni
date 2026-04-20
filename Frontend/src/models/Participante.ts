export type Nivel = "Principiante" | "Intermedio" | "Avanzado";

export type Modalidad = "Presencial" | "Virtual" | "Hibrido";

export type DatosParticipante = {
  id: number;
  nombre: string;
  email: string;
  edad: number;
  pais: string;
  modalidad: Modalidad;
  tecnologias: string[];
  nivel: Nivel;
  aceptaTerminos: boolean;
};

export class Participante {
  id: number;
  nombre: string;
  email: string;
  edad: number;
  pais: string;
  modalidad: Modalidad;
  tecnologias: string[];
  nivel: Nivel;
  aceptaTerminos: boolean;

  constructor(
    id: number,
    nombre: string,
    email: string,
    edad: number,
    pais: string,
    modalidad: Modalidad,
    tecnologias: string[],
    nivel: Nivel,
    aceptaTerminos: boolean,
  ) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.edad = edad;
    this.pais = pais;
    this.modalidad = modalidad;
    this.tecnologias = tecnologias;
    this.nivel = nivel;
    this.aceptaTerminos = aceptaTerminos;
  }

  static desdeObjeto(datos: DatosParticipante) {
    return new Participante(
      datos.id,
      datos.nombre,
      datos.email,
      datos.edad,
      datos.pais,
      datos.modalidad,
      datos.tecnologias,
      datos.nivel,
      datos.aceptaTerminos,
    );
  }
}
