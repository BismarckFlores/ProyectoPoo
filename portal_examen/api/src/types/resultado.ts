export type ResultadoVocabulario = {
    id_resultado: number;
    id_aplicacion: number;
    texto_interpretativo: string | null;
};

export type Puntuacion = {
    id_puntuacion: number;
    id_resultado: number;
    factor: string;
    puntuacion_directa: number;
    puntuacion_tipica: number;
};

export type ResultadoDTO = {
    id_resultado: number;
    texto_interpretativo: string | null;
    puntuaciones: {
        factor: string;
        puntuacion_directa: number;
        puntuacion_tipica: number;
    }[];
};