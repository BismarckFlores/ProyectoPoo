export type FormaVocabulario = {
    id_forma: number;
    tipo: string;
    titulo: string;
    tiempo_limite_seg: number | null;
    item_inicial: number | null;
    item_final: number | null;
    instrucciones: string | null;
};

export type Opcion = {
    id_opcion: number;
    id_item: number;
    letra: string;
    texto: string | null;
};

export type Item = {
    id_item: number;
    id_forma: number;
    numero: number;
    palabra_estimulo: string | null;
    respuesta_correcta: string | null;
    opciones?: Opcion[];
};

// Opción tal como se le envía al frontend: solo letra y texto, nunca cuál es la correcta.
export type OpcionPublica = {
    letra: string;
    texto: string | null;
};

// Item sin la respuesta correcta — es lo que se le envía al frontend
// para que el evaluado no pueda ver las respuestas en el código de la página.
export type ItemPublico = {
    id_item: number;
    numero: number;
    palabra_estimulo: string | null;
    opciones: OpcionPublica[];
};
