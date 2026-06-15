import { RegistrarRespuestaDTO } from './respuesta';

export type AplicacionTest = {
    id_aplicacion: number;
    id_evaluado: number;
    id_forma_a: number;
    id_forma_b: number;
    fecha_examen: string | null;
    finalidad: string | null;
    estado: 'ASIGNADO' | 'EN_PROGRESO' | 'FINALIZADO' | 'CALIFICADO';
};

export type CrearAplicacionDTO = {
    id_evaluado: number;
    finalidad?: string;
};

export type CalificarAplicacionDTO = {
    id_normas: number;
    respuestas: RegistrarRespuestaDTO[];
};
