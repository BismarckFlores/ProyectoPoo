export type FormaVocabulario = {
    id_forma: number;
    tipo: string;
    titulo: string;
    tiempo_limite_seg: number | null;
    item_inicial: number | null;
    item_final: number | null;
    instrucciones: string | null;
};

export type Item = {
    id_item: number;
    id_forma: number;
    numero: number;
    palabra_estimulo: string | null;
    respuesta_correcta: string | null;
};