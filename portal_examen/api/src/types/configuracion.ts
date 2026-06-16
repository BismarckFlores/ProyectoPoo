// Configuración del examen, administrada desde OpenXava.
// Define qué dos formas y qué baremo usa la API. La marcada como `activa` es la vigente.
export type ConfiguracionExamen = {
    id_config: number;
    nombre: string;
    id_forma_a: number;
    id_forma_b: number;
    id_normas: number;
    activa: boolean;
};
