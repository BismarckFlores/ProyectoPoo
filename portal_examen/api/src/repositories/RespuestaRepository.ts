import { Pool } from 'pg';
import { Respuesta } from '../types/respuesta';

export type RespuestaCalculada = {
    id_item: number;
    letra_marcada: string;
    es_correcta: boolean;
};

export class RespuestaRepository {
    constructor(private readonly pool: Pool) {
    }

    // Inserta todas las respuestas de la aplicación en una sola query.
    async createMany(idAplicacion: number, respuestas: RespuestaCalculada[]): Promise<void> {
        if (respuestas.length === 0) return;

        const values: unknown[] = [];
        const tuplas = respuestas.map((r, i) => {
            const b = i * 3;
            values.push(r.id_item, r.letra_marcada, r.es_correcta);
            return `($${b + 1}, $${b + 2}, $${b + 3}, $${respuestas.length * 3 + 1})`;
        });
        values.push(idAplicacion);

        await this.pool.query(
            `INSERT INTO respuesta (id_item, letra_marcada, es_correcta, id_aplicacion)
             VALUES ${tuplas.join(', ')}`,
            values
        );
    }

    async findByAplicacion(idAplicacion: number): Promise<Respuesta[]> {
        const {rows} = await this.pool.query<Respuesta>(
            'SELECT * FROM respuesta WHERE id_aplicacion = $1',
            [idAplicacion]
        );
        return rows;
    }
}
