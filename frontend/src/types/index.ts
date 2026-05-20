export interface Tecnologia {
    id: number;
    nombre: string;
    categoria: string;
}

export interface Proyecto {
    id: number;
    titulo: string;
    descripcion: string;
    urlRepo: string;
    urlDemo: string;
    fechaCreacion: string;
    activo: boolean;
    tecnologias: Tecnologia[];
}

export interface Estudio {
  id: number;
  institucion: string;
  titulo: string;
  fechaInicio: string;
  fechaFin: string | null;
  descripcion: string;
  actual: boolean;
}

export interface Experiencia {
  id: number;
  empresa: string;
  cargo: string;
  fechaInicio: string;
  fechaFin: string | null;
  descripcion: string;
  actual: boolean;
}
export interface Perfil {
  id?: number;
  resumen: string;
  disponibilidad: boolean;
}