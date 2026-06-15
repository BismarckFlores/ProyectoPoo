export type Evaluado = {
    id_evaluado: number;
    primer_apellido: string;
    segundo_apellido: string | null;
    nombre: string;
    fecha_nacimiento: string | null;
    sexo: string | null;
    estudios: string | null;
};

export type CrearEvaluadoDTO = {
    primer_apellido: string;
    segundo_apellido?: string;
    nombre: string;
    fecha_nacimiento?: string;
    sexo?: string;
    estudios?: string;
};