import { Pool } from 'pg';
import { ResultadoVocabulario, Puntuacion } from '../types/resultado';

export class ResultadoRepository {
    constructor(private readonly pool: Pool) {
    }

    async create(idAplicacion: number, textoInterpretativo: string): Promise<ResultadoVocabulario> {
        const {rows} = await this.pool.query<ResultadoVocabulario>(
            `INSERT INTO resultado_vocabulario (id_aplicacion, texto_interpretativo)
             VALUES ($1, $2)
             RETURNING *`,
            [idAplicacion, textoInterpretativo]
        );
        return rows[0];
    }

    async createPuntuacion(idResultado: number, factor: string, pd: number, pt: number): Promise<Puntuacion> {
        const {rows} = await this.pool.query<Puntuacion>(
            `INSERT INTO puntuacion (id_resultado, factor, puntuacion_directa, puntuacion_tipica)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [idResultado, factor, pd, pt]
        );
        return rows[0];
    }

    async findByAplicacion(idAplicacion: number): Promise<ResultadoVocabulario | null> {
        const { rows } = await this.pool.query<ResultadoVocabulario>(
            'SELECT * FROM resultado_vocabulario WHERE id_aplicacion = $1',
            [idAplicacion]
        );
        return rows[0] ?? null;
    }

    async findPuntuacionesByResultado(idResultado: number): Promise<Puntuacion[]> {
        const { rows } = await this.pool.query<Puntuacion>(
            'SELECT * FROM puntuacion WHERE id_resultado = $1',
            [idResultado]
        );
        return rows;
    }
}