export type AplicacionTest = {
    id_aplicacion: number;
    id_evaluado: number;
    id_forma: number;
    fecha_examen: string | null;
    finalidad: string | null;
    estado: 'ASIGNADO' | 'EN_PROGRESO' | 'FINALIZADO' | 'CALIFICADO';
};

export type CrearAplicacionDTO = {
    id_evaluado: number;
    id_forma: number;
    fecha_examen?: string;
    finalidad?: string;
};

export type CalificarAplicacionDTO = {
    id_normas: number;
};