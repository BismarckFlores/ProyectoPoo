export type Respuesta = {
    id_respuesta: number;
    id_aplicacion: number;
    id_item: number;
    letra_marcada: string | null;
    es_correcta: boolean | null;
};

export type RegistrarRespuestaDTO = {
    id_item: number;
    letra_marcada: string;
};